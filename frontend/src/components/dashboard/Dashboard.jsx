import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Globe,
  MessageSquareWarning,
  QrCode,
  FlaskConical,
  ArrowUpRight,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useScans } from '../../context/ScanContext';
import { TELEMETRY_TRENDS, THREAT_CATEGORIES_DATA } from '../../services/mockData';

export default function Dashboard({ setActiveTab }) {
  const { stats, scanHistory, setCurrentResult } = useScans();

  const handleInspect = (item) => {
    if (item.fullResult) {
      setCurrentResult(item.fullResult);
    } else {
      // Create minimal result object if from seed history
      setCurrentResult({
        scanType: item.type,
        inputUrl: item.rawTarget,
        rawText: item.rawTarget,
        defangedUrl: item.target,
        riskScore: item.riskScore,
        threatLevel: item.threatLevel,
        category: item.category,
        explanation: item.summary,
        indicators: [],
        recommendations: [
          'Verify website identity through official bookmarks.',
          'Never enter passwords on unsolicited links.'
        ],
        executionTimeMs: 12,
        timestamp: item.date,
      });
    }
    setActiveTab('results');
  };

  const getSeverityBadge = (level) => {
    switch (level) {
      case 'high_risk':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            HIGH RISK
          </span>
        );
      case 'suspicious':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            SUSPICIOUS
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            SAFE
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight flex items-center gap-2">
            Cyber Threat Dashboard
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              LIVE TELEMETRY
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-1">
            Real-time defensive posture, scanning volume, threat distribution, and detection history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('url-scanner')}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Scan URL</span>
          </button>
          <button
            onClick={() => setActiveTab('message-scanner')}
            className="px-4 py-2 rounded-lg bg-slate-900 light:bg-slate-100 hover:bg-slate-800 text-slate-200 light:text-slate-800 border border-slate-700 light:border-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all"
          >
            <MessageSquareWarning className="w-3.5 h-3.5 text-amber-400" />
            <span>Scan Message</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="p-5 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 light:text-slate-500">Total Scans Executed</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100 light:text-slate-900 font-mono">
              {stats.totalScans.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 flex items-center font-mono">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Aggregate passive security queries</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500/40"></div>
        </div>

        {/* Safe URLs */}
        <div className="p-5 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 light:text-slate-500">Verified Safe Targets</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">
              {stats.safeUrls.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({Math.round((stats.safeUrls / (stats.totalScans || 1)) * 100)}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Zero malicious indicators discovered</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500/40"></div>
        </div>

        {/* Suspicious Scans */}
        <div className="p-5 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 light:text-slate-500">Suspicious Warnings</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">
              {stats.suspiciousScans.toLocaleString()}
            </span>
            <span className="text-xs text-amber-400/80 font-mono">Caution</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Ambiguous or high-entropy signals</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500/40"></div>
        </div>

        {/* High Risk Scams */}
        <div className="p-5 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 light:text-slate-500">Critical Threats Blocked</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400 font-mono">
              {stats.scamMessages.toLocaleString()}
            </span>
            <span className="text-xs text-rose-400/80 font-mono">Active</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Credential phishing & fraud traps</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500/40"></div>
        </div>
      </div>

      {/* Quick Launchpad Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('url-scanner')}
          className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 border border-cyan-800/40 hover:border-cyan-400/60 cursor-pointer transition-all duration-200 group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200 light:text-slate-800 group-hover:text-cyan-400">
                URL & Domain Scanner
              </h4>
              <p className="text-[11px] text-slate-400">Inspect Punycode, TLDs, and entropy</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
        </div>

        <div
          onClick={() => setActiveTab('message-scanner')}
          className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-800/40 hover:border-amber-400/60 cursor-pointer transition-all duration-200 group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200 light:text-slate-800 group-hover:text-amber-400">
                Message Deception Scanner
              </h4>
              <p className="text-[11px] text-slate-400">Detect urgency, lures & credential grabs</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
        </div>

        <div
          onClick={() => setActiveTab('threat-lab')}
          className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 border border-purple-800/40 hover:border-purple-400/60 cursor-pointer transition-all duration-200 group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200 light:text-slate-800 group-hover:text-purple-400">
                Interactive Threat Lab
              </h4>
              <p className="text-[11px] text-slate-400">Practice spotting real attack scenarios</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      {/* Visual Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200 light:text-slate-800 uppercase tracking-wider font-mono">
                7-Day Scanning Volume & Threat Frequency
              </h3>
              <p className="text-xs text-slate-400 light:text-slate-500">
                Comparison of legitimate requests vs. flagged malicious vectors
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              WEEKLY
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TELEMETRY_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorScam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc'
                  }}
                />
                <Area type="monotone" dataKey="total" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" name="Total Scans" />
                <Area type="monotone" dataKey="scams" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorScam)" name="Scams Blocked" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Categories Pie Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-200 light:text-slate-800 uppercase tracking-wider font-mono">
                Threat Distribution
              </h3>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xs text-slate-400 light:text-slate-500 mb-4">
              Breakdown of top detected social engineering categories
            </p>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={THREAT_CATEGORIES_DATA}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {THREAT_CATEGORIES_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#f8fafc'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 mt-2">
            {THREAT_CATEGORIES_DATA.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400 light:text-slate-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-mono text-slate-200 light:text-slate-800 font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Scan Activity Feed */}
      <div className="p-6 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 light:text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Recent Defensive Scans
            </h3>
            <p className="text-xs text-slate-400 light:text-slate-500">
              Live log of inspected URLs, messages, and QR vectors
            </p>
          </div>
          <button
            onClick={() => setActiveTab('results')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
          >
            Full History <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-500 font-mono">
                <th className="py-2.5 px-3">Verdict</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Target (Defanged)</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
              {scanHistory.slice(0, 5).map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/40 light:hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getSeverityBadge(item.threatLevel)}
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
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`font-mono font-bold ${
                      item.riskScore >= 70 ? 'text-rose-400' : item.riskScore >= 35 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {item.riskScore} / 100
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleInspect(item)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors text-[11px] font-mono"
                    >
                      View Report
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
