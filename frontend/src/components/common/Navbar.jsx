import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Globe,
  MessageSquareText,
  QrCode,
  FlaskConical,
  BookOpen,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Menu,
  X,
  Activity,
  History
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useScans } from '../../context/ScanContext';
import { checkBackendHealth } from '../../services/api';

export default function Navbar({ activeTab, setActiveTab }) {
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = useScans();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    checkBackendHealth().then((res) => {
      setBackendStatus(res.isOnline ? 'online' : 'offline');
    });
    const interval = setInterval(() => {
      checkBackendHealth().then((res) => {
        setBackendStatus(res.isOnline ? 'online' : 'offline');
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'url-scanner', label: 'URL Scanner', icon: Globe },
    { id: 'message-scanner', label: 'Message Scanner', icon: MessageSquareText },
    { id: 'quishing-scanner', label: 'Quishing (QR)', icon: QrCode },
    { id: 'threat-lab', label: 'Threat Lab', icon: FlaskConical, badge: 'Interactive' },
    { id: 'encyclopedia', label: 'Scam Library', icon: BookOpen },
    { id: 'results', label: 'Report & History', icon: History },
  ];

  const handleNav = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 dark:bg-slate-950/85 light:bg-white/90 border-b border-slate-800 dark:border-slate-800/80 light:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div
            onClick={() => handleNav('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent border border-cyan-500/30 group-hover:border-cyan-400 transition-all duration-300">
              <ShieldAlert className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                  ScamShield
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  AI DEFENSE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 light:text-slate-500 hidden sm:block">
                Digital Scam & Phishing Detection System
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls: Audio, Theme, Status */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Cyber Sound Alerts: Enabled' : 'Cyber Sound Alerts: Muted'}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 light:hover:bg-slate-100 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Cyber Dark'} mode`}
              className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 light:hover:bg-slate-100 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Engine Status indicator */}
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-800 light:border-slate-200">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
                backendStatus === 'online'
                  ? 'bg-emerald-950/80 border-emerald-600/70 text-emerald-300'
                  : 'bg-cyan-950/60 border-cyan-800/60 text-cyan-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${backendStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`}></span>
                <span>{backendStatus === 'online' ? 'BACKEND: FASTAPI (PORT 8000)' : 'ENGINE: CLIENT DEFENSE'}</span>
              </div>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 space-y-1 bg-slate-950/95 border-b border-slate-800 light:bg-white light:border-slate-200 animate-in fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60 light:text-slate-700 light:hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
