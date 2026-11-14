import React, { useState } from 'react';
import {
  MessageSquareWarning,
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Lock,
  Eye,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { scanMessageApi } from '../../services/api';
import { useScans } from '../../context/ScanContext';

export default function MessageScanner({ setActiveTab }) {
  const { addScanResult } = useScans();
  const [messageText, setMessageText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const sampleMessages = [
    {
      label: 'USPS Delivery SMS',
      text: 'USPS Alert: Your package #US9842 cannot be delivered due to incomplete address. Update address & pay $1.85 redelivery fee at: https://usps-post-redelivery.org/update immediately.'
    },
    {
      label: 'Bank Freeze Threat',
      text: 'URGENT: Your Chase checking account is temporarily locked due to suspicious activity. Verify your PIN and SSN at https://secure-chase-update.xyz/login within 24 hours to prevent permanent closure.'
    },
    {
      label: 'CEO Wire Transfer',
      text: 'Subject: QUICK FAVOR - IN A MEETING\nAre you in the office right now? I need an urgent wire transfer executed for an overseas consultant before noon. Reply with your cell number immediately.'
    },
    {
      label: 'Legitimate Colleague Email',
      text: 'Hi Sarah, attached are the updated sprint review slides from today\'s retrospective. Please check slide 4 and let me know if the metrics align with Q3 results. Thanks!'
    }
  ];

  const handleAnalyze = async () => {
    if (!messageText.trim() || messageText.trim().length < 3) {
      setErrorMessage('Please paste or write a message of at least 3 characters to analyze.');
      return;
    }
    setErrorMessage('');
    setIsAnalyzing(true);
    setScanResult(null);

    try {
      const result = await scanMessageApi(messageText);
      setIsAnalyzing(false);
      if (!result.isValid) {
        setErrorMessage(result.error);
        return;
      }

      setScanResult(result);
      addScanResult(result);

      if (result.threatLevel === 'safe') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setIsAnalyzing(false);
      setErrorMessage(err.message || 'Failed to analyze message');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <MessageSquareWarning className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
            SMS, Email & Social Media Scam Detector
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
            NLP DECEPTION ENGINE
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-1">
          Detects psychological coercion, artificial urgency deadlines, impersonation signals, and credential-harvesting prompts.
        </p>
      </div>

      {/* Main Input Box */}
      <div className="p-6 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono uppercase text-slate-400 light:text-slate-600 font-semibold">
              Suspicious Message Content (SMS / Email / DM)
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              {messageText.length} characters
            </span>
          </div>

          <textarea
            rows={5}
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="Paste suspicious text message, email body, or DM here... e.g. 'URGENT: Your bank account is locked. Click here to verify...'"
            className="w-full p-4 rounded-xl bg-slate-950/80 light:bg-slate-50 border border-slate-700 light:border-slate-300 text-slate-100 light:text-slate-900 placeholder:text-slate-500 font-sans text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-y"
          />

          {errorMessage && (
            <p className="mt-2 text-xs text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {errorMessage}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setMessageText('')}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Clear Text
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Analyzing Deception Signals...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Analyze Message</span>
              </>
            )}
          </button>
        </div>

        {/* Realistic Samples */}
        <div className="pt-3 border-t border-slate-800/60 light:border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 light:text-slate-500 uppercase">
              Or Test With A Realistic Scenario:
            </span>
            <span className="text-[10px] text-amber-400 font-mono">Instant Test</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleMessages.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMessageText(s.text);
                  setErrorMessage('');
                }}
                className="p-2.5 rounded-lg bg-slate-800/60 light:bg-slate-100 hover:bg-slate-700/80 light:hover:bg-slate-200 border border-slate-700/60 light:border-slate-300 text-left transition-colors"
              >
                <span className="text-xs font-semibold text-slate-200 light:text-slate-800 block">
                  {s.label}
                </span>
                <span className="text-[11px] text-slate-400 light:text-slate-500 truncate block mt-0.5">
                  {s.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Output */}
      {scanResult && !isAnalyzing && (
        <div className={`p-6 rounded-2xl border shadow-xl space-y-6 transition-all ${
          scanResult.threatLevel === 'high_risk'
            ? 'bg-rose-950/20 border-rose-500/40'
            : scanResult.threatLevel === 'suspicious'
            ? 'bg-amber-950/20 border-amber-500/40'
            : 'bg-emerald-950/20 border-emerald-500/40'
        }`}>
          {/* Verdict Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 light:border-slate-200">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${
                scanResult.threatLevel === 'high_risk'
                  ? 'bg-rose-500/20 text-rose-400'
                  : scanResult.threatLevel === 'suspicious'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {scanResult.threatLevel === 'high_risk' ? (
                  <ShieldAlert className="w-7 h-7" />
                ) : scanResult.threatLevel === 'suspicious' ? (
                  <AlertTriangle className="w-7 h-7" />
                ) : (
                  <ShieldCheck className="w-7 h-7" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-xl font-extrabold uppercase tracking-tight ${
                    scanResult.threatLevel === 'high_risk'
                      ? 'text-rose-400'
                      : scanResult.threatLevel === 'suspicious'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    {scanResult.threatLevel === 'high_risk'
                      ? 'Fraudulent / Scam Attack Detected'
                      : scanResult.threatLevel === 'suspicious'
                      ? 'Suspicious Communication'
                      : 'Normal / Low-Risk Message'}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {scanResult.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  NLP evaluation took {scanResult.executionTimeMs}ms • Client-Side Token Isolation
                </p>
              </div>
            </div>

            {/* Risk Gauge */}
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Deception Score</span>
              <span className={`text-2xl font-black font-mono ${
                scanResult.riskScore >= 65
                  ? 'text-rose-400'
                  : scanResult.riskScore >= 35
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}>
                {scanResult.riskScore}/100
              </span>
            </div>
          </div>

          {/* Plain Language Explanation */}
          <div className="p-4 rounded-xl bg-slate-900/90 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-xs text-slate-300 light:text-slate-700 leading-relaxed">
            <p>
              <strong className="text-slate-100 light:text-slate-900">Psychological Modus Operandi: </strong>
              {scanResult.explanation}
            </p>
          </div>

          {/* Trigger Indicators */}
          {scanResult.indicators && scanResult.indicators.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 light:text-slate-700 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Detected Social Engineering Patterns ({scanResult.indicators.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scanResult.indicators.map((ind, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-950/70 light:bg-white border border-slate-800 light:border-slate-200 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 light:text-slate-800">
                        {ind.title}
                      </span>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        ind.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-400'
                          : ind.severity === 'high'
                          ? 'bg-rose-500/15 text-rose-300'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}>
                        {ind.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 light:text-slate-600 leading-relaxed">
                      {ind.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations Banner */}
          <div className="p-4 rounded-xl bg-slate-950/80 light:bg-white border border-slate-800 light:border-slate-200 space-y-2">
            <h5 className="text-xs font-mono uppercase text-cyan-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Recommended Safety Actions
            </h5>
            <ul className="space-y-1 text-xs text-slate-300 light:text-slate-700">
              {scanResult.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-800 light:border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Want to see the emergency response protocol?
            </span>
            <button
              onClick={() => setActiveTab('results')}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>View Full Report & Action Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
