import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SCAN_HISTORY, INITIAL_STATS } from '../services/mockData';

const ScanContext = createContext();

// Cyber Audio Feedback using Web Audio API (zero audio file dependencies)
function playCyberTone(type) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'danger') {
      // Urgent double beep
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.setValueAtTime(450, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'safe') {
      // Clean cheerful chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      // Subtle click/radar blip
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch {
    // Ignore audio errors silently if user hasn't interacted with page
  }
}

export function ScanProvider({ children }) {
  const [scanHistory, setScanHistory] = useState(() => {
    const saved = localStorage.getItem('scamshield_history');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_SCAN_HISTORY; }
    }
    return INITIAL_SCAN_HISTORY;
  });

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('scamshield_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_STATS; }
    }
    return INITIAL_STATS;
  });

  const [currentResult, setCurrentResult] = useState(() => scanHistory[0] || null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    localStorage.setItem('scamshield_history', JSON.stringify(scanHistory));
  }, [scanHistory]);

  useEffect(() => {
    localStorage.setItem('scamshield_stats', JSON.stringify(stats));
  }, [stats]);

  const addScanResult = (result) => {
    const historyItem = {
      id: `scan-${Date.now()}`,
      target: result.scanType === 'url' ? result.defangedUrl : (result.rawText.slice(0, 75) + '...'),
      rawTarget: result.scanType === 'url' ? result.inputUrl : result.rawText,
      type: result.scanType,
      riskScore: result.riskScore,
      threatLevel: result.threatLevel,
      category: result.category,
      timestamp: 'Just now',
      date: new Date().toLocaleString(),
      summary: result.explanation,
      indicatorsCount: result.indicators ? result.indicators.length : 0,
      fullResult: result,
    };

    setScanHistory(prev => [historyItem, ...prev]);
    setCurrentResult(result);

    // Update statistics
    setStats(prev => ({
      ...prev,
      totalScans: prev.totalScans + 1,
      safeUrls: result.threatLevel === 'safe' && result.scanType === 'url' ? prev.safeUrls + 1 : prev.safeUrls,
      suspiciousScans: result.threatLevel === 'suspicious' ? prev.suspiciousScans + 1 : prev.suspiciousScans,
      scamMessages: result.threatLevel === 'high_risk' && result.scanType === 'message' ? prev.scamMessages + 1 : prev.scamMessages,
    }));

    if (soundEnabled) {
      if (result.threatLevel === 'high_risk') {
        playCyberTone('danger');
      } else if (result.threatLevel === 'safe') {
        playCyberTone('safe');
      } else {
        playCyberTone('click');
      }
    }
  };

  const clearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('scamshield_history');
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  return (
    <ScanContext.Provider
      value={{
        scanHistory,
        stats,
        currentResult,
        setCurrentResult,
        addScanResult,
        clearHistory,
        soundEnabled,
        toggleSound,
        playTone: (type) => soundEnabled && playCyberTone(type),
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScans() {
  return useContext(ScanContext);
}
