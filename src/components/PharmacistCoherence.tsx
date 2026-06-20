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
  RefreshCw,
  Gauge,
  Zap,
  Flame,
  ShieldCheck,
  Search,
  Check
} from "lucide-react";
import GlassCard from "./GlassCard";

// Import the generated premium 3D pill bottle asset
// @ts-ignore
import pillBottleImg from "../assets/images/3d_prescription_pill_bottle_1781988028395.jpg";

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
    setCalibrationLog("MOLECULAR_ALIGNMENT_SUCCESS: All automatic bio-prescriptions synced to the decentralized ledger.");
  };

  return (
    <div id="pharmacist-coherence-container" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Rotating 3D Prescriptions monitor and controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div id="pharmacist-3d-chemical-lattice" className="relative w-full rounded-2xl border border-slate-900 bg-[#040c16]/90 overflow-hidden flex flex-col justify-between p-6 hover:border-emerald-500/10 transition-all shadow-xl">
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
            <div className="absolute inset-0 cyber-dot-grid opacity-15 pointer-events-none" />
            
            {/* Holographic Header */}
            <div className="z-10 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
                <span className="font-mono text-[10px] tracking-widest text-slate-400">PRESCRIPTION_CYBER_SYNTHESIZER</span>
              </div>
              <span className="font-mono text-[9px] text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase font-bold leading-none">
                3D Dispenser Active
              </span>
            </div>

            {/* Real 3D pill bottle image rendering center stage */}
            <div className="flex flex-col items-center justify-center relative min-h-[300px] my-2 z-10">
              {/* Green scanner scanning wave laser overlay */}
              <div className="absolute top-1/4 w-44 h-[2px] bg-emerald-400 opacity-60 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-bounce" />
              
              <div className="absolute bottom-6 w-36 h-12 border-t border-emerald-500/20 rounded-full scale-y-50 rotate-[-10deg] bg-emerald-500/3 animate-pulse flex items-center justify-center">
                <div className="w-16 h-4 border-t border-emerald-400/30 rounded-full animate-ping" />
              </div>

              <div className="relative w-40 h-52 flex items-center justify-center overflow-hidden hover:scale-[1.04] transition-all duration-500 rounded-2xl">
                <img
                  src={pillBottleImg}
                  alt="3D Prescription Pill Bottle"
                  className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_24px_rgba(16,185,129,0.2)]"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="text-center mt-2">
                <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-400 leading-none">Formulation Container Sec-1</span>
                <p className="text-[9px] text-slate-500 mt-0.5">Biocompatible Smart Capsule Deployment System</p>
              </div>
            </div>

            {/* Bottom Molecular HUD Metrics */}
            <div className="z-10 grid grid-cols-3 bg-[#05111d] p-3.5 rounded-xl border border-slate-900 gap-2.5 text-center leading-none">
              <div className="flex flex-col items-center justify-center border-r border-slate-900">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[9px] font-mono tracking-wider">CRYO_BASE</span>
                </div>
                <span className="text-sm font-semibold tracking-tight text-white font-mono">
                  -80.0 <span className="text-[9px] text-emerald-400">°C</span>
                </span>
                <div className="text-[8px] font-mono text-slate-500 mt-1">Temperature Lock</div>
              </div>

              <div className="flex flex-col items-center justify-center border-r border-slate-900 col-auto">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Wind className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[9px] font-mono tracking-wider">PRESSURE</span>
                </div>
                <span className="text-sm font-semibold tracking-tight text-white font-mono">
                  {cryoPressure}% <span className="text-[8px] text-emerald-400 font-semibold">COH</span>
                </span>
                <div className="text-[8px] font-mono text-slate-500 mt-1">Atmospheric Seal</div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[9px] font-mono tracking-wider">PURITY_INDEX</span>
                </div>
                <span className="text-sm font-semibold tracking-tight text-slate-200 font-mono">99.87%</span>
                <div className="text-[8px] font-mono text-slate-500 mt-1">Zero Congestion</div>
              </div>
            </div>
          </div>

          <GlassCard glowColor="none" hoverable={false} className="p-4 bg-slate-950/40 border-slate-900">
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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 hover:from-emerald-500/20 hover:to-teal-500/15 border border-emerald-500/25 hover:border-emerald-500/40 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
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
                    className="p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 font-mono text-[9.5px] rounded-lg flex items-center gap-2"
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
          <GlassCard glowColor="cyan" hoverable={false} className="p-5 border-slate-900 bg-[#040c16]/90">
            <h4 className="font-display font-medium text-xs text-white border-b border-slate-900 pb-2.5 mb-4 uppercase tracking-wider">
              Vessel Synthesis Health & Metrics
            </h4>

            <div className="space-y-4">
              {compounds.map((comp) => (
                <div
                  key={comp.vesselId}
                  className="bg-[#05111d] border border-slate-900 p-4 rounded-xl space-y-3 font-mono text-[10.5px] leading-none"
                >
                  <div className="flex justify-between items-start leading-none gap-2">
                    <div>
                      <h5 className="font-display text-xs font-bold text-slate-200 mt-1 block leading-normal">{comp.name}</h5>
                      <span className="text-[8.5px] text-slate-500 mt-1 block">{comp.vesselId}</span>
                    </div>
                    <span className="text-[8px] bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 leading-none">
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
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                        style={{ width: `${comp.purity}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard glowColor="none" hoverable={false} className="p-4 bg-slate-950/60 leading-normal text-[10px] border-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                Pharmacy-Gate Certifications
              </span>
            </div>
            <p className="font-mono text-slate-400 text-[9px] leading-relaxed">
              Pharmaceutical and compound modifications require concurrent authorization of the clinician signature keys and active patient consent grant logs. All updates successfully synced to distributed Vital Twin ledger blocks.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
