import React, { useState } from 'react';
import {
  FlaskConical,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Smartphone,
  Mail,
  Eye,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { THREAT_LAB_SCENARIOS } from '../../services/mockData';
import { useScans } from '../../context/ScanContext';

export default function ThreatLab({ setActiveTab }) {
  const { playTone } = useScans();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [userGuess, setUserGuess] = useState(null); // true (scam) or false (safe)
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const scenario = THREAT_LAB_SCENARIOS[currentScenarioIndex];

  const handleGuess = (isScamGuess) => {
    if (revealed) return;
    setUserGuess(isScamGuess);
    setRevealed(true);

    const isCorrect = isScamGuess === scenario.isScam;
    setScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }));

    if (isCorrect) {
      playTone('safe');
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      playTone('danger');
    }
  };

  const handleNext = () => {
    setUserGuess(null);
    setRevealed(false);
    setCurrentScenarioIndex((prev) => (prev + 1) % THREAT_LAB_SCENARIOS.length);
  };

  const handleResetScore = () => {
    setScore({ correct: 0, total: 0 });
    setUserGuess(null);
    setRevealed(false);
    setCurrentScenarioIndex(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
              Threat Lab – Phishing Simulator
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              INTERACTIVE TRAINING
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-1">
            Test and sharpen your defensive instincts against real-world social engineering scenarios.
          </p>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-3 p-2.5 px-4 rounded-xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200">
          <Award className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Defense Accuracy</span>
            <span className="text-sm font-bold font-mono text-slate-100 light:text-slate-900">
              {score.total > 0 ? `${Math.round((score.correct / score.total) * 100)}%` : 'Ready'} ({score.correct}/{score.total})
            </span>
          </div>
          {score.total > 0 && (
            <button
              onClick={handleResetScore}
              className="text-[11px] text-slate-400 hover:text-white ml-2 p-1"
              title="Reset score"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Simulator Scenario Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-6">
        {/* Scenario Progress */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 light:border-slate-200 text-xs font-mono">
          <span className="text-purple-400">
            SCENARIO {currentScenarioIndex + 1} OF {THREAT_LAB_SCENARIOS.length}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
            {scenario.type} ATTACK SIMULATION
          </span>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-100 light:text-slate-900">
            {scenario.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sender: <span className="font-mono text-cyan-300">{scenario.sender}</span>
          </p>
        </div>

        {/* Simulated Message Preview Box */}
        <div className="relative p-5 rounded-2xl bg-slate-950/90 light:bg-slate-100 border border-slate-800 light:border-slate-300 shadow-inner font-sans text-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-500 text-xs pb-2 border-b border-slate-800/80 light:border-slate-300">
            {scenario.type === 'SMS' ? <Smartphone className="w-4 h-4 text-cyan-400" /> : <Mail className="w-4 h-4 text-purple-400" />}
            <span className="font-mono text-[11px]">INCOMING SIMULATED TRANSMISSION</span>
          </div>

          <div className="text-slate-200 light:text-slate-800 whitespace-pre-wrap leading-relaxed">
            {scenario.content}
          </div>
        </div>

        {/* User Interactive Buttons */}
        {!revealed ? (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleGuess(true)}
              className="w-full sm:w-1/2 py-3.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/40 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Flag as SCAM / PHISHING</span>
            </button>

            <button
              onClick={() => handleGuess(false)}
              className="w-full sm:w-1/2 py-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify as LEGITIMATE / SAFE</span>
            </button>
          </div>
        ) : (
          /* Reveal Section */
          <div className="space-y-6 animate-in fade-in pt-2">
            {/* Verdict Box */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              userGuess === scenario.isScam
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/50 text-rose-300'
            }`}>
              <div className="flex items-center gap-3">
                {userGuess === scenario.isScam ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-bold">
                    {userGuess === scenario.isScam ? 'Correct! Outstanding Cyber Instincts!' : 'Watch Out! You Were Tricked!'}
                  </h4>
                  <p className="text-xs opacity-90 mt-0.5">
                    This scenario is officially classified as: <strong>{scenario.isScam ? 'MALICIOUS SCAM' : 'LEGITIMATE COMMUNICATION'}</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Red Flags Breakdown */}
            {scenario.redFlags.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/80 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-2">
                <h4 className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Key Deception Indicators Identified:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300 light:text-slate-700">
                  {scenario.redFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">✕</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Action */}
            <div className="p-4 rounded-xl bg-slate-950/80 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-xs text-slate-300 light:text-slate-700">
              <strong className="text-cyan-400 font-mono block mb-1">PRO DEFENSIVE ACTION:</strong>
              {scenario.recommendedAction}
            </div>

            {/* Next Scenario Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-purple-500/20"
              >
                <span>Next Scenario Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
