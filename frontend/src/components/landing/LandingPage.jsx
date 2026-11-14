import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Globe,
  MessageSquareWarning,
  QrCode,
  FlaskConical,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Lock,
  Cpu,
  BarChart3
} from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  const attackVectors = [
    {
      title: 'Phishing URLs & Lookalikes',
      desc: 'Detects typosquatting, IDN homoglyphs (Cyrillic lookalikes), raw IP hostnames, and deep nested subdomains targeting banks and tech brands.',
      icon: Globe,
      color: 'from-cyan-500 to-blue-600',
      badge: 'URL Analysis'
    },
    {
      title: 'Smishing & Fraudulent SMS',
      desc: 'Pinpoints coercive urgency, fake postal delivery failures, bank freeze threats, and obfuscated redirect links before you tap.',
      icon: MessageSquareWarning,
      color: 'from-amber-500 to-orange-600',
      badge: 'Message NLP'
    },
    {
      title: 'Quishing (QR Code Traps)',
      desc: 'Analyzes suspicious QR codes found on parking meters, restaurant stickers, and spam flyers to uncover malicious concealed URLs.',
      icon: QrCode,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Visual Defense'
    },
    {
      title: 'Interactive Threat Simulator',
      desc: 'Educational sandbox featuring real-world attack scenarios (CEO fraud, crypto giveaways, fake KYC) to sharpen your cybersecurity reflexes.',
      icon: FlaskConical,
      color: 'from-purple-500 to-pink-600',
      badge: 'Threat Lab'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Input & Defanging',
      desc: 'Safely parses target URLs or message bodies without executing outbound network calls or opening live malware vectors.'
    },
    {
      num: '02',
      title: 'Heuristics & Entropy',
      desc: 'Evaluates character Shannon entropy, Punycode encoding, domain age flags, and urgency lexical triggers.'
    },
    {
      num: '03',
      title: 'Composite Risk Scoring',
      desc: 'Calculates a normalized 0 to 100 risk index weighted across lexical, structural, and behavioral indicators.'
    },
    {
      num: '04',
      title: 'Plain-English Guidance',
      desc: 'Delivers clear, non-technical explanations and a step-by-step emergency action plan on what to do next.'
    }
  ];

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16">
        {/* Cyber glow background accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-emerald-500/10 blur-[120px] pointer-events-none rounded-full"></div>

        <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-mono mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>NEXT-GEN SCAM & PHISHING DEFENSE PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 light:text-slate-900 leading-[1.15]">
            Neutralize Digital Scams <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Before They Compromise You.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 light:text-slate-600 max-w-2xl mx-auto leading-relaxed">
            ScamShield combines deep structural URL inspection, natural language deception analysis, and explainable threat scoring to detect phishing URLs, fraudulent SMS, and impersonation attempts.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('url-scanner')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Globe className="w-4 h-4 text-slate-950" />
              <span>Scan a Suspicious URL</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={() => setActiveTab('message-scanner')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 light:bg-slate-100 hover:bg-slate-800 light:hover:bg-slate-200 text-slate-200 light:text-slate-800 border border-slate-700 light:border-slate-300 font-semibold text-sm transition-all duration-200"
            >
              <MessageSquareWarning className="w-4 h-4 text-amber-400" />
              <span>Analyze SMS / Email</span>
            </button>

            <button
              onClick={() => setActiveTab('threat-lab')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-800/60 font-semibold text-sm transition-all duration-200"
            >
              <FlaskConical className="w-4 h-4 text-purple-400" />
              <span>Interactive Threat Lab</span>
            </button>
          </div>

          {/* Trust & Guarantee Badges */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
            <div className="p-3 rounded-lg bg-slate-900/60 light:bg-slate-100/80 border border-slate-800 light:border-slate-200">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
                <Lock className="w-3.5 h-3.5" /> 100% Client-Safe
              </div>
              <p className="text-[11px] text-slate-400 light:text-slate-500 mt-1">URLs defanged; no malware execution</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 light:bg-slate-100/80 border border-slate-800 light:border-slate-200">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                <Cpu className="w-3.5 h-3.5" /> Multi-Layer Engine
              </div>
              <p className="text-[11px] text-slate-400 light:text-slate-500 mt-1">Heuristics + NLP + Entropy</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 light:bg-slate-100/80 border border-slate-800 light:border-slate-200">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold">
                <Eye className="w-3.5 h-3.5" /> Lookalike Hunter
              </div>
              <p className="text-[11px] text-slate-400 light:text-slate-500 mt-1">Punycode & Cyrillic detection</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 light:bg-slate-100/80 border border-slate-800 light:border-slate-200">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold">
                <BarChart3 className="w-3.5 h-3.5" /> Explainable AI
              </div>
              <p className="text-[11px] text-slate-400 light:text-slate-500 mt-1">Actionable remediation steps</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Attack Vectors Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
            Comprehensive Digital Threat Vectors
          </h2>
          <p className="text-sm text-slate-400 light:text-slate-600 mt-2">
            Modern social engineering bypasses basic spam filters. ScamShield inspects the technical and psychological deception techniques used by attackers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {attackVectors.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="group relative p-6 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200 hover:border-cyan-500/50 light:hover:border-cyan-500/50 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${v.color} text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-800 light:bg-slate-100 text-slate-300 light:text-slate-600 border border-slate-700 light:border-slate-300">
                      {v.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 light:text-slate-900 group-hover:text-cyan-400 transition-colors">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 light:text-slate-600 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How the Detection Pipeline Works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 light:from-slate-50 light:to-white border border-slate-800 light:border-slate-200 relative overflow-hidden">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
              TECHNICAL ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 light:text-slate-900 mt-3">
              How ScamShield Inspects Threats
            </h2>
            <p className="text-xs text-slate-400 light:text-slate-600 mt-2">
              Every query undergoes multi-stage defensive vetting designed to protect user privacy and deliver rapid security verdicts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div key={idx} className="relative p-5 rounded-xl bg-slate-950/60 light:bg-slate-100/70 border border-slate-800/80 light:border-slate-200">
                <span className="text-2xl font-black font-mono text-cyan-400/40">
                  {s.num}
                </span>
                <h4 className="text-sm font-bold text-slate-200 light:text-slate-800 mt-2">
                  {s.title}
                </h4>
                <p className="text-xs text-slate-400 light:text-slate-600 mt-1 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800/80 light:border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Phase 1 Frontend Defense Engine Active with zero remote external tracking.</span>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <span>Open Threat Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
