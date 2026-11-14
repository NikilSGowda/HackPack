import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  History,
  Copy,
  Check,
  Download,
  Trash2,
  ExternalLink,
  Info,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  Layers,
  FileText,
  Clock
} from 'lucide-react';
import { useScans } from '../../context/ScanContext';

export default function ResultsView({ setActiveTab }) {
  const { currentResult, scanHistory, clearHistory, setCurrentResult } = useScans();
  const [copied, setCopied] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [historySearch, setHistorySearch] = useState('');
  const [checkedActions, setCheckedActions] = useState({});

  const active = currentResult || (scanHistory.length > 0 ? scanHistory[0] : null);

  const handleCopyTarget = () => {
    if (!active) return;
    const textToCopy = active.defangedUrl || active.target || active.rawTarget || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    if (!active) return;
    const blob = new Blob([JSON.stringify(active, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scamshield-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleAction = (idx) => {
    setCheckedActions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Filter history
  const filteredHistory = scanHistory.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = item.target.toLowerCase().includes(historySearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(historySearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getThreatBadge = (level) => {
    switch (level) {
      case 'high_risk':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            HIGH RISK THREAT
          </span>
        );
      case 'suspicious':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            SUSPICIOUS CAUTION
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            VERIFIED SAFE
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
              Security Evaluation & Scan History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-1">
            Forensic threat telemetry, plain-language breakdown, and instant remediation checklist.
          </p>
        </div>

        {active && (
          <button
            onClick={handleExportJson}
            className="self-start sm:self-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Forensic JSON</span>
          </button>
        )}
      </div>

      {/* Active Scan Comprehensive Report */}
      {active ? (
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-8 transition-all ${
          active.threatLevel === 'high_risk'
            ? 'bg-gradient-to-b from-rose-950/30 to-slate-900/90 border-rose-500/40'
            : active.threatLevel === 'suspicious'
            ? 'bg-gradient-to-b from-amber-950/30 to-slate-900/90 border-amber-500/40'
            : 'bg-gradient-to-b from-emerald-950/30 to-slate-900/90 border-emerald-500/40'
        }`}>
          {/* Top Banner with Verdict & Score Gauge */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80 light:border-slate-200">
            <div className="flex items-start gap-4">
              <div className={`p-4 rounded-2xl ${
                active.threatLevel === 'high_risk'
                  ? 'bg-rose-500/20 text-rose-400 cyber-glow-rose'
                  : active.threatLevel === 'suspicious'
                  ? 'bg-amber-500/20 text-amber-400 cyber-glow-amber'
                  : 'bg-emerald-500/20 text-emerald-400 cyber-glow-emerald'
              }`}>
                {active.threatLevel === 'high_risk' ? (
                  <ShieldAlert className="w-10 h-10" />
                ) : active.threatLevel === 'suspicious' ? (
                  <AlertTriangle className="w-10 h-10" />
                ) : (
                  <ShieldCheck className="w-10 h-10" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getThreatBadge(active.threatLevel)}
                  <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    Category: {active.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-100 light:text-slate-900 tracking-tight">
                  {active.threatLevel === 'high_risk'
                    ? 'Critical Deception Signals Flagged'
                    : active.threatLevel === 'suspicious'
                    ? 'Unusual Risk Indicators Present'
                    : 'Target Passed All Defensive Checks'}
                </h2>
                <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Scan Date: {active.date || active.timestamp || 'Recent'}</span>
                  <span>•</span>
                  <span>Type: {(active.scanType || active.type || 'url').toUpperCase()}</span>
                </p>
              </div>
            </div>

            {/* Circular Risk Score Representation */}
            <div className="flex items-center gap-4 bg-slate-950/80 light:bg-white p-4 rounded-2xl border border-slate-800 light:border-slate-200 shrink-0">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#1e293b"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke={active.riskScore >= 70 ? '#f43f5e' : active.riskScore >= 35 ? '#f59e0b' : '#10b981'}
                    strokeWidth="5"
                    strokeDasharray={163.3}
                    strokeDashoffset={163.3 - (163.3 * (active.riskScore || 0)) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute font-mono font-black text-base text-slate-100 light:text-slate-900">
                  {active.riskScore}
                </span>
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Calculated Index</span>
                <span className="text-xs font-bold text-slate-200 light:text-slate-800">
                  {active.riskScore >= 70 ? 'Extreme Hazard' : active.riskScore >= 35 ? 'Moderate Hazard' : 'Minimal Hazard'}
                </span>
                <span className="text-[10px] text-slate-500 block">Scale 0 (Clean) to 100 (Deadly)</span>
              </div>
            </div>
          </div>

          {/* Defanged Target Bar */}
          <div className="p-4 rounded-2xl bg-slate-950/80 light:bg-slate-100 border border-slate-800 light:border-slate-300 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Defanged Target Entity (Safe to Display):
            </span>
            <div className="flex items-center justify-between gap-3 font-mono text-xs">
              <span className="text-cyan-300 light:text-cyan-800 truncate select-all">
                {active.defangedUrl || active.target || active.rawTarget}
              </span>
              <button
                onClick={handleCopyTarget}
                className="p-1.5 rounded-lg hover:bg-slate-800 light:hover:bg-slate-200 text-slate-400 hover:text-white transition-colors shrink-0"
                title="Copy defanged address"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Plain-English Explanation */}
          <div className="p-5 rounded-2xl bg-slate-900/90 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-2">
            <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              Plain-Language Security Summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 light:text-slate-700 leading-relaxed">
              {active.explanation || active.summary}
            </p>
          </div>

          {/* Detected Threat Indicators (if any) */}
          {active.indicators && active.indicators.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 light:text-slate-700 font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Detected Threat Signals ({active.indicators.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {active.indicators.map((ind, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-950/70 light:bg-white border border-slate-800 light:border-slate-200 space-y-1.5"
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

          {/* Homoglyph Confusable Inspector (if present) */}
          {active.homoglyphs && active.homoglyphs.containsHomoglyph && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-2">
              <h4 className="text-xs font-mono uppercase text-rose-300 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Visual Homoglyph Attack Exposed:
              </h4>
              <p className="text-xs text-slate-300">
                This link uses invisible Unicode characters to mimic: <span className="font-mono text-emerald-400 font-bold">{active.homoglyphs.normalized}</span>
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {active.homoglyphs.flags.map((f, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-slate-950 text-[11px] font-mono text-amber-300 border border-slate-800">
                    Char "{f.char}" ({f.unicode}) is spoofing Latin "{f.spoofing}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Immediate Action Checklist */}
          <div className="p-5 rounded-2xl bg-slate-950/80 light:bg-white border border-slate-800 light:border-slate-200 space-y-3">
            <h3 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Immediate Defensive Remediation Checklist
            </h3>
            <p className="text-xs text-slate-400 light:text-slate-600">
              Check off recommended actions as you complete them:
            </p>
            <div className="space-y-2">
              {(active.recommendations || [
                'Do NOT open the target link or submit sensitive credentials.',
                'If you already entered passwords, immediately change them on the real service website.',
                'Forward suspicious SMS text messages to 7726 (SPAM).',
                'Verify accounts by opening the official app directly rather than following links.'
              ]).map((rec, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                    checkedActions[idx]
                      ? 'bg-emerald-950/30 text-slate-400 line-through'
                      : 'hover:bg-slate-900/60 light:hover:bg-slate-50 text-slate-200 light:text-slate-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checkedActions[idx]}
                    onChange={() => toggleAction(idx)}
                    className="mt-0.5 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs leading-relaxed">{rec}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
          <History className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No Active Scan Loaded</h3>
          <p className="text-xs text-slate-500 mt-1">Select an item from history below or run a new scan from the scanner tabs.</p>
        </div>
      )}

      {/* Historical Scans Table & Management */}
      <div className="p-6 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 light:text-slate-900 font-mono flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              Full Scan History Archive ({scanHistory.length})
            </h3>
            <p className="text-xs text-slate-400 light:text-slate-500">
              Local persistent record of all analyzed targets
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="flex rounded-lg bg-slate-950 light:bg-slate-100 p-1 border border-slate-800 light:border-slate-300 text-xs font-mono">
              {['all', 'url', 'message'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 rounded text-[11px] uppercase transition-colors ${
                    filterType === t
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Clear History */}
            {scanHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition-colors"
                title="Clear all history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
            placeholder="Search targets or categories in history..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 light:bg-slate-50 border border-slate-700 light:border-slate-300 text-xs text-slate-200 light:text-slate-900 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-500 font-mono">
                <th className="py-2.5 px-3">Verdict</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Target (Defanged)</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Score</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
              {filteredHistory.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-800/40 light:hover:bg-slate-50 transition-colors ${
                    active?.id === item.id ? 'bg-cyan-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getThreatBadge(item.threatLevel)}
                  </td>
                  <td className="py-3 px-3 uppercase font-mono text-[11px] text-slate-400">
                    {item.type}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300 light:text-slate-700 max-w-xs truncate" title={item.target}>
                    {item.target}
                  </td>
                  <td className="py-3 px-3 text-slate-400 light:text-slate-600 whitespace-nowrap">
                    {item.category}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold whitespace-nowrap">
                    <span className={
                      item.riskScore >= 70 ? 'text-rose-400' : item.riskScore >= 35 ? 'text-amber-400' : 'text-emerald-400'
                    }>
                      {item.riskScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        setCurrentResult(item.fullResult || item);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-slate-700 text-[11px] font-mono"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
