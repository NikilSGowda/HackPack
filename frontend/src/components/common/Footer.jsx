import React from 'react';
import { ShieldCheck, AlertTriangle, ExternalLink, Terminal, Lock } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="mt-20 border-t border-slate-800/80 light:border-slate-200 bg-slate-950/70 light:bg-slate-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-slate-100 light:text-slate-900 tracking-tight text-lg">
                ScamShield AI
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                DEFENSIVE CYBER
              </span>
            </div>
            <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed max-w-md">
              ScamShield is an open, client-hardened digital scam detection and threat intelligence platform.
              Designed to protect consumers and organizations from phishing campaigns, homoglyph impersonations,
              and manipulative social engineering vectors.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-cyan-400" /> Client-Side Privacy First
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Zero Live Malware Execution
              </span>
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 light:text-slate-700 mb-3 font-mono">
              Detection Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 light:text-slate-600">
              <li>
                <button onClick={() => setActiveTab('url-scanner')} className="hover:text-cyan-400 transition-colors">
                  Phishing URL Analyzer
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('message-scanner')} className="hover:text-cyan-400 transition-colors">
                  SMS & Email Scam Detector
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('quishing-scanner')} className="hover:text-cyan-400 transition-colors">
                  Quishing (QR Code) Scanner
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('threat-lab')} className="hover:text-cyan-400 transition-colors">
                  Phishing Simulator (Threat Lab)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('encyclopedia')} className="hover:text-cyan-400 transition-colors">
                  Digital Scam Encyclopedia
                </button>
              </li>
            </ul>
          </div>

          {/* Global Cyber Reporting */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 light:text-slate-700 mb-3 font-mono">
              Report Real Threats
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 light:text-slate-600">
              <li>
                <a
                  href="https://www.ic3.gov"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  FBI Internet Crime Complaint (IC3) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://apwg.org"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  Anti-Phishing Working Group (APWG) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://reportfraud.ftc.gov"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  FTC ReportFraud.gov <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="pt-1 text-[11px] text-slate-500 font-mono">
                Forward phishing SMS to: <span className="text-amber-400">7726 (SPAM)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Cyber Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-900/60 light:bg-slate-100 border border-slate-800 light:border-slate-200 text-xs text-slate-400 light:text-slate-600 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-200 light:text-slate-800">Defensive & Educational Disclaimer:</strong> ScamShield is developed strictly for educational awareness, defensive threat evaluation, and security research. Detection results reflect heuristic heuristics and probabilistic models; zero false-positive or zero false-negative performance cannot be guaranteed. Always verify sensitive accounts through trusted official channels.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/60 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono">
          <p>© 2026 ScamShield. Autonomous Cybersecurity Defense Engine.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-2">
            <span>React 18</span> • <span>Tailwind CSS</span> • <span>Vite</span> • <span>FastAPI Ready</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
