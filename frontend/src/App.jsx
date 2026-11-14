import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LandingPage from './components/landing/LandingPage';
import Dashboard from './components/dashboard/Dashboard';
import UrlScanner from './components/scanner/UrlScanner';
import MessageScanner from './components/scanner/MessageScanner';
import QuishingScanner from './components/scanner/QuishingScanner';
import ThreatLab from './components/simulator/ThreatLab';
import ScamEncyclopedia from './components/knowledge/ScamEncyclopedia';
import ResultsView from './components/results/ResultsView';
import { ShieldAlert, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 transition-colors">
      {/* Standalone Engine Notification Ribbon */}
      <div className="bg-gradient-to-r from-cyan-950/90 via-slate-950 to-blue-950/90 border-b border-cyan-800/40 text-[11px] font-mono text-cyan-300 py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>SCAMSHIELD DEFENSIVE ENGINE ACTIVE:</span>
        <span className="text-slate-300 hidden sm:inline">Autonomous Heuristic Inspection • Punycode & Urgency Lexicon • Zero Tracking</span>
      </div>

      {/* Main Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'landing' && <LandingPage setActiveTab={setActiveTab} />}
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'url-scanner' && <UrlScanner setActiveTab={setActiveTab} />}
        {activeTab === 'message-scanner' && <MessageScanner setActiveTab={setActiveTab} />}
        {activeTab === 'quishing-scanner' && <QuishingScanner setActiveTab={setActiveTab} />}
        {activeTab === 'threat-lab' && <ThreatLab setActiveTab={setActiveTab} />}
        {activeTab === 'encyclopedia' && <ScamEncyclopedia />}
        {activeTab === 'results' && <ResultsView setActiveTab={setActiveTab} />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
