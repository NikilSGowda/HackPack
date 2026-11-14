import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SCAM_ENCYCLOPEDIA_ARTICLES } from '../../services/mockData';

export default function ScamEncyclopedia() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(SCAM_ENCYCLOPEDIA_ARTICLES[0].id);

  const filtered = SCAM_ENCYCLOPEDIA_ARTICLES.filter(art =>
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
            Digital Scam & Threat Encyclopedia
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            KNOWLEDGE BASE
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-1">
          In-depth educational reference covering the mechanics, psychological tricks, and defensive countermeasures for modern cyber threats.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search scam types, attack vectors, or keywords (e.g. 'Punycode', 'SMS', 'QR')..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/80 light:bg-white border border-slate-700 light:border-slate-300 text-slate-100 light:text-slate-900 font-sans text-xs focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filtered.map((art) => {
          const isExpanded = expandedId === art.id;
          return (
            <div
              key={art.id}
              className="p-6 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-sm transition-all"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : art.id)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 light:text-slate-900">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Threat Severity: <span className="font-mono text-rose-400 font-bold">{art.severity}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-cyan-400 font-mono hidden sm:inline">
                    {isExpanded ? 'Collapse' : 'Learn More'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Collapsed Description */}
              <p className="text-xs text-slate-300 light:text-slate-600 mt-3 leading-relaxed">
                {art.description}
              </p>

              {/* Expanded Deep Dive */}
              {isExpanded && (
                <div className="mt-6 pt-5 border-t border-slate-800/80 light:border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in">
                  {/* Telltale Signs */}
                  <div className="p-4 rounded-xl bg-slate-950/70 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-2">
                    <h4 className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Telltale Signs & Red Flags:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300 light:text-slate-700">
                      {art.telltaleSigns.map((sign, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold mt-0.5">•</span>
                          <span>{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Defensive Countermeasures */}
                  <div className="p-4 rounded-xl bg-slate-950/70 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-2">
                    <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Defensive Checklist:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300 light:text-slate-700">
                      {art.defensiveTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
