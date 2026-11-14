/**
 * ScamShield Frontend API Client
 * Connects to the FastAPI Python backend with automatic resilient fallback
 * to client-side heuristics when offline.
 */

import { analyzeUrl as analyzeUrlClient, analyzeMessage as analyzeMessageClient } from './detectionEngine';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Checks backend health status
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error(`Health status ${res.status}`);
    const data = await res.json();
    return { isOnline: true, data };
  } catch (err) {
    return { isOnline: false, error: err.message };
  }
}

/**
 * Sends URL to backend API for passive threat analysis
 */
export async function scanUrlApi(url) {
  try {
    const res = await fetch(`${API_BASE_URL}/scan/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.detail || errorJson.error || `HTTP error ${res.status}`);
    }

    const data = await res.json();
    // Transform backend snake_case response to camelCase for frontend components
    return {
      isValid: true,
      inputUrl: url,
      defangedUrl: data.target,
      riskScore: data.risk_score,
      threatLevel: data.threat_level,
      category: data.threat_category,
      explanation: data.explanation,
      indicators: data.detected_indicators.map(ind => ({
        id: ind.code,
        title: ind.title,
        severity: ind.severity,
        description: ind.description,
        weight: ind.weight,
        details: ind.details
      })),
      recommendations: data.security_recommendations,
      executionTimeMs: data.execution_time_ms,
      scanType: data.scan_type,
      timestamp: data.timestamp,
      backendPowered: true
    };
  } catch (err) {
    console.warn(`[ScamShield API] Backend call failed, using client-side heuristics engine: ${err.message}`);
    const clientResult = analyzeUrlClient(url);
    clientResult.backendPowered = false;
    clientResult.fallbackNotice = `Evaluated via client-side heuristics (Backend: ${err.message})`;
    return clientResult;
  }
}

/**
 * Sends message to backend API for NLP & deception analysis
 */
export async function scanMessageApi(message, sender = null) {
  try {
    const res = await fetch(`${API_BASE_URL}/scan/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ message, sender }),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.detail || errorJson.error || `HTTP error ${res.status}`);
    }

    const data = await res.json();
    return {
      isValid: true,
      rawText: message,
      riskScore: data.risk_score,
      threatLevel: data.threat_level,
      category: data.threat_category,
      explanation: data.explanation,
      indicators: data.detected_indicators.map(ind => ({
        id: ind.code,
        title: ind.title,
        severity: ind.severity,
        description: ind.description,
        weight: ind.weight,
        details: ind.details
      })),
      recommendations: data.security_recommendations,
      executionTimeMs: data.execution_time_ms,
      scanType: data.scan_type,
      timestamp: data.timestamp,
      backendPowered: true
    };
  } catch (err) {
    console.warn(`[ScamShield API] Backend call failed, using client-side heuristics engine: ${err.message}`);
    const clientResult = analyzeMessageClient(message);
    clientResult.backendPowered = false;
    clientResult.fallbackNotice = `Evaluated via client-side heuristics (Backend: ${err.message})`;
    return clientResult;
  }
}
