import React, { useState } from 'react';
import {
  Globe,
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { scanUrlApi } from '../../services/api';
import { useScans } from '../../context/ScanContext';

export default function UrlScanner({ setActiveTab }) {
  const { addScanResult } = useScans();
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Feature inspection options
  const [options, setOptions] = useState({
    checkHomoglyphs: true,
    checkEntropy: true,
    checkSubdomains: true,
    checkTldReputation: true,
  });

  const sampleUrls = [
    { label: 'Fake Chase Bank', url: 'https://secure-chase-update.verify-acc-login.xyz/auth' },
    { label: 'Punycode PayPal', url: 'https://pаypal.com/signin' },
    { label: 'Raw IP Phish', url: 'http://185.220.101.5/wp-admin/login.php' },
    { label: 'Legitimate Site', url: 'https://github.com/torvalds/linux' },
    { label: 'Obfuscated Shortlink', url: 'https://bit.ly/urgent-account-resolve' }
  ];

  const handleScan = async () => {
    if (!urlInput.trim()) {
      setErrorMessage('Please enter or select a website URL to analyze.');
      return;
    }
    setErrorMessage('');
    setIsScanning(true);
    setScanResult(null);

    try {
      const result = await scanUrlApi(urlInput);
      setIsScanning(false);
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
      setIsScanning(false);
      setErrorMessage(err.message || 'Failed to scan URL');
    }
  };

  const handleCopyDefanged = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult.defangedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Globe className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
            Phishing & Malicious URL Scanner
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            STRUCTURAL HEURISTICS
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-1">
          Inspects domain age anomalies, lookalike punycode characters, deep nested subdomains, and credential theft traps safely.
        </p>
      </div>

      {/* Main Input Box */}
      <div className="p-6 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-5">
        <div className="relative">
          <label className="block text-xs font-mono uppercase text-slate-400 light:text-slate-600 mb-2 font-semibold">
            Target Web Address (URL)
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              placeholder="e.g. https://secure-bank-login.xyz/update or domain.com"
              className="w-full pl-4 pr-32 py-3.5 rounded-xl bg-slate-950/80 light:bg-slate-50 border border-slate-700 light:border-slate-300 text-slate-100 light:text-slate-900 placeholder:text-slate-500 font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            {urlInput && (
              <button
                onClick={() => setUrlInput('')}
                className="absolute right-28 text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="absolute right-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Scan URL</span>
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <p className="mt-2 text-xs text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {errorMessage}
            </p>
          )}
        </div>

        {/* Sample Targets Bar */}
        <div className="pt-2 border-t border-slate-800/60 light:border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 light:text-slate-500 uppercase">
              Or Try A Realistic Threat Sample:
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">1-Click Load</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleUrls.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUrlInput(s.url);
                  setErrorMessage('');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 light:hover:bg-slate-200 border border-slate-700/60 light:border-slate-300 text-xs text-slate-300 light:text-slate-700 transition-colors flex items-center gap-1"
              >
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Analysis Configuration Pills */}
        <div className="pt-3 border-t border-slate-800/60 light:border-slate-200">
          <div className="flex items-center gap-2 mb-2 text-[11px] font-mono text-slate-400 uppercase">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Deep Inspection Layers:</span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            {Object.entries({
              checkHomoglyphs: 'IDN Homoglyphs & Cyrillic Confusables',
              checkEntropy: 'Shannon Entropy (DGA Detection)',
              checkSubdomains: 'Subdomain Nesting Depth',
              checkTldReputation: 'Risky TLD Reputation Matrix',
            }).map(([key, label]) => (
              <label key={key} className="flex items-center gap-1.5 text-slate-300 light:text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-slate-800 border-slate-700"
                />
                <span className="text-[11px]">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Radar Scanning Visual State */}
      {isScanning && (
        <div className="p-10 rounded-2xl bg-slate-900/60 border border-cyan-500/30 text-center space-y-4 relative overflow-hidden">
          <div className="animate-scan-line"></div>
          <div className="w-20 h-20 mx-auto rounded-full border-2 border-cyan-500/40 border-dashed animate-spin flex items-center justify-center">
            <Globe className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-slate-200 font-mono">
            EXECUTING HEURISTIC THREAT SCAN
          </h3>
          <p className="text-xs text-cyan-400 font-mono">
            Evaluating Punycode • Calculating Shannon Entropy • Inspecting SSL & TLD Matrix...
          </p>
        </div>
      )}

      {/* Scan Results Card */}
      {scanResult && !isScanning && (
        <div className={`p-6 rounded-2xl border shadow-xl space-y-6 transition-all ${
          scanResult.threatLevel === 'high_risk'
            ? 'bg-rose-950/20 border-rose-500/40'
            : scanResult.threatLevel === 'suspicious'
            ? 'bg-amber-950/20 border-amber-500/40'
            : 'bg-emerald-950/20 border-emerald-500/40'
        }`}>
          {/* Header Verdict */}
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
                      ? 'High-Risk Malicious Threat'
                      : scanResult.threatLevel === 'suspicious'
                      ? 'Suspicious Target Detected'
                      : 'Verified Safe Web Address'}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {scanResult.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Analysis completed in {scanResult.executionTimeMs}ms • Client-Safe Defanged Output
                </p>
              </div>
            </div>

            {/* Risk Gauge Pill */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Risk Score</span>
                <span className={`text-2xl font-black font-mono ${
                  scanResult.riskScore >= 70
                    ? 'text-rose-400'
                    : scanResult.riskScore >= 35
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {scanResult.riskScore}/100
                </span>
              </div>
            </div>
          </div>

          {/* Defanged Target URL Display */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 light:bg-slate-100 border border-slate-800 light:border-slate-300 flex items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="text-slate-500 uppercase text-[10px] shrink-0 font-bold">Defanged:</span>
              <span className="text-cyan-300 light:text-cyan-700 truncate select-all">
                {scanResult.defangedUrl}
              </span>
            </div>
            <button
              onClick={handleCopyDefanged}
              className="p-1.5 rounded hover:bg-slate-800 light:hover:bg-slate-200 text-slate-400 hover:text-white transition-colors shrink-0"
              title="Copy defanged URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Plain Language Explanation */}
          <div className="p-4 rounded-xl bg-slate-900/90 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-xs text-slate-300 light:text-slate-700 leading-relaxed">
            <p>
              <strong className="text-slate-100 light:text-slate-900">Security Assessment: </strong>
              {scanResult.explanation}
            </p>
          </div>

          {/* Detected Indicators List */}
          {scanResult.indicators && scanResult.indicators.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 light:text-slate-700 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Detected Threat Characteristics ({scanResult.indicators.length})
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
                          : ind.severity === 'warning'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-cyan-500/15 text-cyan-400'
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

          {/* Footer Action to Full Report */}
          <div className="pt-4 border-t border-slate-800 light:border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Need comprehensive emergency actions or forensic details?
            </span>
            <button
              onClick={() => setActiveTab('results')}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>View Full Report & Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
