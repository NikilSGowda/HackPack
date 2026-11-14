import React, { useState } from 'react';
import {
  QrCode,
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Upload,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Camera,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { analyzeUrl } from '../../services/detectionEngine';
import { useScans } from '../../context/ScanContext';

export default function QuishingScanner({ setActiveTab }) {
  const { addScanResult } = useScans();
  const [qrUrlInput, setQrUrlInput] = useState('');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const qrScenarios = [
    {
      id: 'qr-1',
      title: 'Parking Meter Superimposed Sticker',
      subtitle: 'Physical sticker pasted over real city parking meter',
      targetUrl: 'https://city-parking-pay.quick-meter-auth.top/pay?zone=4910',
      risk: 'high',
      description: 'Physical quishing attack capturing debit cards through lookalike domain .top'
    },
    {
      id: 'qr-2',
      title: 'Fake Restaurant Menu QR',
      subtitle: 'Tabletop sticker asking for contact & payment info',
      targetUrl: 'https://dine-order-auth.verify-menu.xyz/table-14',
      risk: 'high',
      description: 'Phishing attack mimicking restaurant ordering portal'
    },
    {
      id: 'qr-3',
      title: 'Legitimate Electric Vehicle (EV) Charger',
      subtitle: 'Official charging station QR code',
      targetUrl: 'https://chargepoint.com/drivers/mobile-app',
      risk: 'safe',
      description: 'Official EV network portal with valid SSL and genuine domain'
    }
  ];

  const handleRunScan = (urlToScan) => {
    const target = urlToScan || qrUrlInput;
    if (!target) return;

    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      const result = analyzeUrl(target);
      result.scanType = 'qr_code';
      result.quishingMetadata = selectedScenario;

      setIsScanning(false);
      setScanResult(result);
      addScanResult(result);

      if (result.threatLevel === 'safe') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <QrCode className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 light:text-slate-900 tracking-tight">
            Quishing (QR Code Phishing) Defense Inspector
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            VISUAL-TO-URL DEFENSE
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-1">
          Scammers place counterfeit QR stickers over parking meters, EV chargers, and restaurant menus to lure victims to fake payment portals.
        </p>
      </div>

      {/* Interactive Quishing Lab Grid */}
      <div className="p-6 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-6">
        <div>
          <h3 className="text-sm font-bold font-mono uppercase text-slate-200 light:text-slate-800 mb-2">
            Select A Real-World QR Vector Or Paste Decoded Link:
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Test how attackers disguise malicious URLs within physical QR codes:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {qrScenarios.map((scen) => (
              <div
                key={scen.id}
                onClick={() => {
                  setSelectedScenario(scen);
                  setQrUrlInput(scen.targetUrl);
                  handleRunScan(scen.targetUrl);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 text-left flex flex-col justify-between ${
                  selectedScenario?.id === scen.id
                    ? 'border-emerald-500 bg-emerald-950/20 shadow-md'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/60 light:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <QrCode className={`w-5 h-5 ${scen.risk === 'high' ? 'text-rose-400' : 'text-emerald-400'}`} />
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      scen.risk === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {scen.risk === 'high' ? 'Malicious QR' : 'Safe QR'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 light:text-slate-800">
                    {scen.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {scen.subtitle}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-cyan-400 flex items-center justify-between">
                  <span>Click to Test</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual URL input from QR code */}
        <div className="pt-4 border-t border-slate-800/80 light:border-slate-200">
          <label className="block text-xs font-mono uppercase text-slate-400 light:text-slate-600 mb-2">
            Or Enter Target URL Read From QR Code:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={qrUrlInput}
              onChange={(e) => setQrUrlInput(e.target.value)}
              placeholder="e.g. https://quick-parking-meter.top/pay"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 light:bg-slate-50 border border-slate-700 light:border-slate-300 text-slate-100 light:text-slate-900 font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleRunScan(qrUrlInput)}
              disabled={isScanning || !qrUrlInput.trim()}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Inspect QR Destination</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scanning State */}
      {isScanning && (
        <div className="p-10 rounded-2xl bg-slate-900/60 border border-emerald-500/30 text-center space-y-4 relative overflow-hidden">
          <div className="animate-scan-line"></div>
          <div className="w-16 h-16 mx-auto rounded-xl border-2 border-emerald-500/40 border-dashed animate-pulse flex items-center justify-center">
            <QrCode className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-200 font-mono">
            EXTRACTING & VETTING QR HYPERLINK TARGET
          </h3>
        </div>
      )}

      {/* Result Card */}
      {scanResult && !isScanning && (
        <div className={`p-6 rounded-2xl border shadow-xl space-y-5 transition-all ${
          scanResult.threatLevel === 'high_risk'
            ? 'bg-rose-950/20 border-rose-500/40'
            : scanResult.threatLevel === 'suspicious'
            ? 'bg-amber-950/20 border-amber-500/40'
            : 'bg-emerald-950/20 border-emerald-500/40'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${
                scanResult.threatLevel === 'high_risk'
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {scanResult.threatLevel === 'high_risk' ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 uppercase tracking-tight">
                  {scanResult.threatLevel === 'high_risk' ? 'Malicious Quishing Link Detected' : 'Verified Legitimate QR Destination'}
                </h3>
                <p className="text-xs text-slate-400">
                  Defanged: <span className="font-mono text-cyan-300">{scanResult.defangedUrl}</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Risk Index</span>
              <span className={`text-xl font-bold font-mono ${
                scanResult.riskScore >= 70 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {scanResult.riskScore}/100
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 text-xs text-slate-300 leading-relaxed border border-slate-800">
            {scanResult.explanation}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Quishing vectors conceal URLs until scanned. Always preview target domains.
            </span>
            <button
              onClick={() => setActiveTab('results')}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Inspect Full Security Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
