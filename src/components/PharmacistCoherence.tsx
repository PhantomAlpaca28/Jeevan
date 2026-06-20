/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Pill,
  Thermometer,
  Wind,
  Layers,
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Gauge,
  Zap,
  Flame,
  ShieldCheck
} from "lucide-react";
import GlassCard from "./GlassCard";

interface ChemicalCompound {
  name: string;
  purity: number;
  stabilizerPercent: number;
  temperatureCelsius: number;
  vesselId: string;
  criticalAlarm: boolean;
}

export default function PharmacistCoherence() {
  const [compounds, setCompounds] = useState<ChemicalCompound[]>([
    {
      name: "Gamma-Synaptic Calibrant Complex",
      purity: 99.98,
      stabilizerPercent: 94.2,
      temperatureCelsius: -78.4,
      vesselId: "VESSEL-09A",
      criticalAlarm: false
    },
    {
      name: "Autonomic Autoregulation Serum Delta",
      purity: 98.74,
      stabilizerPercent: 88.6,
      temperatureCelsius: -82.1,
      vesselId: "VESSEL-14B",
      criticalAlarm: false
    },
    {
      name: "Neuro-Peptide Resiliency Blockers",
      purity: 94.21,
      stabilizerPercent: 91.0,
      temperatureCelsius: -74.9,
      vesselId: "VESSEL-03C",
      criticalAlarm: false
    }
  ]);

  const [cryoPressure, setCryoPressure] = useState(98.4);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationLog, setCalibrationLog] = useState<string | null>(null);

  // Periodic molecular pulse fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setCompounds((prev) =>
        prev.map((c) => {
          const drift = (Math.random() - 0.5) * 0.1;
          const tempDrift = (Math.random() - 0.5) * 0.5;
          return {
            ...c,
            purity: Math.min(100, Math.max(90, +(c.purity + drift).toFixed(2))),
            temperatureCelsius: +(c.temperatureCelsius + tempDrift).toFixed(1)
          };
        })
      );
      // Pressure drift
      setCryoPressure((p) => Math.min(100, Math.max(90, +(p + (Math.random() - 0.5) * 0.2).toFixed(1))));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRecalibrateVessels = async () => {
    setIsCalibrating(true);
    setCalibrationLog(null);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setCompounds((prev) =>
      prev.map((c) => ({
        ...c,
        purity: Math.min(100, Math.max(99.5, +(99.8 + (Math.random() - 0.5) * 0.1).toFixed(2))),
        temperatureCelsius: -80.0
      }))
    );
    setCryoPressure(99.0);
    setIsCalibrating(false);
    setCalibrationLog("MOLECULAR_ALIGNMENT_SUCCESS: All biocatalyst vessels optimized to -80.0°C cryo-baseline.");
  };

  return (
    <div id="pharmacist-coherence-container" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Rotating Molecular Lattice Visualization and controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div id="pharmacist-3d-chemical-lattice" className="relative w-full h-[360px] md:h-[420px] rounded-2xl glass-panel overflow-hidden flex flex-col justify-between p-5 border border-neon-cyan/20 bg-slate-950/20">
            <div className="absolute inset-0 cyber-dot-grid opacity-30 pointer-events-none" />
            
            {/* Holographic Header */}
            <div className="z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                <span className="font-mono text-[10px] tracking-widest text-slate-400">BIOPHARMACEUTIC_MONITOR</span>
              </div>
              <span className="font-mono text-[9px] text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 px-2.5 py-0.5 rounded uppercase font-bold leading-none">
                Cryo-Vesicle Active
              </span>
            </div>

            {/* Simulated Animated Molecular Geometry Map */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-72 h-72">
                {/* Rotating outermost circle */}
                <div className="absolute inset-0 rounded-full border border-dashed border-neon-blue/30 animate-[spin_40s_linear_infinite]" />
                {/* Rotating middle circle with orbit items */}
                <div className="absolute inset-6 rounded-full border border-neon-cyan/15 animate-[spin_25s_linear_infinite_reverse]">
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-neon-cyan/80 shadow-[0_0_8px_rgba(0,240,255,0.7)]" />
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-neon-purple/80 shadow-[0_0_8px_rgba(189,0,255,0.7)]" />
                </div>
                {/* Rotating inside geometric cage */}
                <div className="absolute inset-14 flex items-center justify-center animate-[spin_12s_linear_infinite]">
                  <svg className="w-full h-full text-neon-blue/40" viewBox="0 0 100 100" type="svg">
                    <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="currentColor" strokeWidth="0.8" />
                    <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="5" y1="25" x2="95" y2="75" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="5" y1="75" x2="95" y2="25" stroke="currentColor" strokeWidth="0.5" />
                    
                    {/* Glowing Atoms */}
                    <circle cx="50" cy="50" r="6" className="fill-neon-cyan/80 stroke-neon-cyan animate-pulse" />
                    <circle cx="50" cy="15" r="3.5" className="fill-neon-blue/80 stroke-neon-blue" />
                    <circle cx="85" cy="32" r="3" className="fill-neon-purple/90" />
                    <circle cx="15" cy="68" r="3" className="fill-neon-purple/90" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Molecular HUD Metrics */}
            <div className="z-10 grid grid-cols-3 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-xl border border-neon-cyan/10 gap-2.5 text-center leading-none">
              <div className="flex flex-col items-center justify-center border-r border-neon-cyan/10">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-neon-cyan" />
                  <span className="text-[9px] font-mono tracking-wider">CRYO_BASE</span>
                </div>
                <span className="text-sm font-semibold tracking-tight text-white font-mono">
                  -80.0 <span className="text-[9px] text-neon-cyan">°C</span>
                </span>
                <div className="text-[8px] font-mono text-neon-cyan/80 mt-0.5">Absolute Threshold</div>
              </div>

              <div className="flex flex-col items-center justify-center border-r border-neon-cyan/10 col-auto">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Wind className="w-3.5 h-3.5 text-neon-blue" />
                  <span className="text-[9px] font-mono tracking-wider">PRESSURE</span>
                </div>
                <span className="text-sm font-semibold tracking-tight text-white font-mono">
                  {cryoPressure}% <span className="text-[8px] text-neon-blue font-semibold">COH</span>
                </span>
                <div className="text-[8px] font-mono text-neon-blue/80 mt-0.5">Atmospheric Seal</div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Layers className="w-3.5 h-3.5 text-neon-purple" />
                  <span className="text-[9px] font-mono tracking-wider">PURITY_INDEX</span>
                </div>
                <span className="text-sm font-semibold tracking-tight text-slate-200 font-mono">99.87%</span>
                <div className="text-[8px] font-mono text-neon-purple/80 mt-0.5">Zero Congestion</div>
              </div>
            </div>
          </div>

          <GlassCard glowColor="none" hoverable={false} className="p-4 bg-slate-950/40">
            <h4 className="font-display font-medium text-xs text-white border-b border-slate-900 pb-2 mb-3">
              Molecular Core Calibration Controls
            </h4>
            <p className="font-mono text-[10.5px] text-slate-400 leading-normal mb-4">
              Trigger instant helium alignment cycles to stabilize dynamic bio-compounds in micro-cryogenic storage pipelines against ledger sync drifts.
            </p>
            <div className="flex flex-col gap-3">
              <button
                id="recalibrate-compounds-btn"
                onClick={handleRecalibrateVessels}
                disabled={isCalibrating}
                className="w-full py-3 rounded-lg border border-neon-cyan/30 text-neon-cyan font-mono text-[10px] uppercase font-bold tracking-wider hover:bg-neon-cyan/10 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isCalibrating ? "animate-spin" : ""}`} />
                {isCalibrating ? "Aligning Cryogenic Core Lattice..." : "Perform He-Lattice Recalibration"}
              </button>

              <AnimatePresence>
                {calibrationLog && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-neon-cyan/5 border border-neon-cyan/30 text-neon-cyan font-mono text-[9.5px] rounded-lg flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{calibrationLog}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>

        {/* Right column: Storage vessels state monitors */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <GlassCard glowColor="cyan" hoverable={false} className="p-5">
            <h4 className="font-display font-medium text-xs text-white border-b border-slate-900 pb-2.5 mb-4">
              Vessel Synthesis Health & Metrics
            </h4>

            <div className="space-y-4">
              {compounds.map((comp) => (
                <div
                  key={comp.vesselId}
                  className="bg-slate-950/50 border border-slate-900/60 p-4 rounded-xl space-y-3 font-mono text-[10.5px] leading-none"
                >
                  <div className="flex justify-between items-start leading-none gap-2">
                    <div>
                      <h5 className="font-display text-xs font-bold text-slate-200 mt-1 block leading-normal">{comp.name}</h5>
                      <span className="text-[8.5px] text-slate-500 mt-1 block">{comp.vesselId}</span>
                    </div>
                    <span className="text-[8px] bg-neon-cyan/5 border border-neon-cyan/20 text-neon-cyan px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 leading-none">
                      Purity {comp.purity}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-slate-900/40">
                    <div>
                      <span className="text-[7.5px] text-slate-500 uppercase font-black block tracking-wider mb-1">Vessel Temp</span>
                      <strong className="text-white font-medium">{comp.temperatureCelsius} °C</strong>
                    </div>

                    <div>
                      <span className="text-[7.5px] text-slate-500 uppercase font-black block tracking-wider mb-1">Stabilizer Envelope</span>
                      <strong className="text-slate-300 font-medium">{comp.stabilizerPercent}% Stable</strong>
                    </div>
                  </div>

                  {/* Progressive visual bar for purity coherence */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[8px] text-slate-500">
                      <span>CATIONIC_STABILITY</span>
                      <span>{comp.purity}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full transition-all duration-1000"
                        style={{ width: `${comp.purity}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard glowColor="none" hoverable={false} className="p-4 bg-slate-950/60 leading-normal text-[10px]">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-2.5">
              <ShieldCheck className="w-4 h-4 text-neon-green" />
              <span className="font-mono text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                Pharmacy-Gate Certifications
              </span>
            </div>
            <p className="font-mono text-slate-400 text-[9px] leading-relaxed">
              Pharmaceutical and compound modifications require concurrent authorization of the clinician signature keys and active patient consent grant logs. All updates successfully synced to distributed Vortexa ledger blocks.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
