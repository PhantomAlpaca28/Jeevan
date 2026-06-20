/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Clock,
  ChevronRight,
  Sparkles,
  Zap,
  Play,
  Pause,
  Sliders,
  TrendingUp,
  Activity,
  Award,
  Globe
} from "lucide-react";
import GlassCard from "../../components/GlassCard";

type TimeMachineStep = "week" | "month" | "year";

interface HistoricalMilestone {
  date: string;
  category: "vitals" | "genetics" | "records" | "consent";
  title: string;
  description: string;
  facility: string;
  efficiencyScore: number; // e.g. 98%
}

export default function HealthDataTimeMachine() {
  const [activeStep, setActiveStep] = useState<TimeMachineStep>("week");
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto playback of scrubbing cycles
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((current) => {
          if (current === "week") return "month";
          if (current === "month") return "year";
          return "week"; // wrap around
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleStepSelect = (step: TimeMachineStep) => {
    setIsPlaying(false);
    setActiveStep(step);
  };

  // Dynamic details based on the history state selected
  const getDataForStep = (step: TimeMachineStep) => {
    switch (step) {
      case "week":
        return {
          rangeLabel: "Last 7 Days (June 13 - June 20, 2026)",
          vitalsSummary: "Stable heart coherence, elevated sleep REM periods, and minor gamma oscillation amplitude surges (42Hz).",
          averageCoherence: "98.4%",
          ledgerNodes: "12 Synchronizations",
          svgChartPath: "M0,60 Q30,20 60,70 T120,40 T180,90 T240,30 T300,50 T360,20 T420,80 T480,50 T540,65 T600,40",
          milestones: [
            {
              date: "June 19, 2026",
              category: "vitals",
              title: "Cardiac Resonance Sync Cycle",
              description: "Continuous vitals handshake with Aetheric Synapsis approved. Autonomic balance registered optimal.",
              facility: "Aetheric Synapsis Core Node",
              efficiencyScore: 99
            },
            {
              date: "June 16, 2026",
              category: "consent",
              title: "Sovereign Proxy Authorization Granted",
              description: "Dynamic temporal key activated for Dr. Stone during real-time cognitive coherence consultation.",
              facility: "Operator Clinical Node",
              efficiencyScore: 95
            }
          ] as HistoricalMilestone[]
        };
      case "month":
        return {
          rangeLabel: "Last 30 Days (May 20 - June 20, 2026)",
          vitalsSummary: "Averaging 95.8% coherence. Includes HLA genetic mapping integration and dynamic policy audits with high-refraction isolations.",
          averageCoherence: "95.8%",
          ledgerNodes: "48 Synchronizations",
          svgChartPath: "M0,80 Q35,40 70,85 T140,55 T210,120 T280,45 T350,95 T420,35 T490,75 T560,110 T600,60",
          milestones: [
            {
              date: "June 02, 2026",
              category: "genetics",
              title: "ZKP Genomic Blueprint Sequence Appended",
              description: "Completed full genome sequencing (HLA cluster). Enforced strict ledger isolation to block unapproved insurer indexing.",
              facility: "Global Longevity Genome Commons",
              efficiencyScore: 98
            },
            {
              date: "May 25, 2026",
              category: "records",
              title: "Synaptic Resiliency Scan Registered",
              description: "GAMMA structure coherence mapping. Fully compiled and added to diagnostic records wallet.",
              facility: "Synaptic Imaging Lab Alpha",
              efficiencyScore: 94
            }
          ] as HistoricalMilestone[]
        };
      case "year":
        return {
          rangeLabel: "Last 365 Days (June 2025 - June 2026)",
          vitalsSummary: "Diagnostic log tracks transition from initial autonomic dysregulation syndrome to fully stabilized neural coherence.",
          averageCoherence: "89.2%",
          ledgerNodes: "512 Synchronizations",
          svgChartPath: "M0,120 Q40,110 80,140 T160,100 T240,165 T320,80 T400,125 T480,70 T560,115 T600,90",
          milestones: [
            {
              date: "Feb 12, 2026",
              category: "records",
              title: "Initial Autonomic Balance Profiling",
              description: "High-density biometric diagnostics sequence initialized. Historic baseline established.",
              facility: "Sovereign Diagnostics Core Node",
              efficiencyScore: 92
            },
            {
              date: "Nov 08, 2025",
              category: "consent",
              title: "Sovereign Ledger Genesis Initialization",
              description: "Cryptographic health identity established. Sovereign private keys linked with client-side Zero-Knowledge wallets.",
              facility: "Vital Twin Network Registry",
              efficiencyScore: 100
            }
          ] as HistoricalMilestone[]
        };
    }
  };

  const activeData = getDataForStep(activeStep);

  return (
    <div id="health-data-time-machine" className="space-y-6">
      {/* Slider/Play header container */}
      <GlassCard glowColor="cyan" hoverable={false} className="p-5.5">
        <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-display font-medium text-sm text-white">Health Data Temporal Time Machine</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Scrub through multi-epoch sovereign diagnostic history and ledger milestones.</p>
          </div>
          
          <button
            id="time-machine-play-toggle"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-1.5 rounded-lg font-mono text-[9.5px] uppercase font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all border ${
              isPlaying
                ? "bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan animate-pulse"
                : "bg-slate-950 border-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> Pause Playback
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-neon-cyan" /> Auto-Cycle Epochs
              </>
            )}
          </button>
        </div>

        {/* Scrubbing slider interface */}
        <div className="mt-8 relative px-4 md:px-10">
          {/* Slider track background bar */}
          <div className="absolute left-6 right-6 md:left-12 md:right-12 top-4 h-1 bg-slate-900 rounded-full" />
          
          {/* Active fill visual track block */}
          <div
            className="absolute left-6 md:left-12 top-4 h-1 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full transition-all duration-300"
            style={{
              width:
                activeStep === "week"
                  ? "0%"
                  : activeStep === "month"
                  ? "50%"
                  : "100%",
            }}
          />

          {/* Time indicators clickable nodes */}
          <div className="relative flex justify-between">
            {/* Step 1: Week */}
            <div className="flex flex-col items-center">
              <button
                id="step-node-week"
                type="button"
                onClick={() => handleStepSelect("week")}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer z-10 ${
                  activeStep === "week"
                    ? "bg-slate-950 border-neon-cyan text-neon-cyan shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                    : "bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800"
                }`}
              >
                <span className="font-mono text-[10.5px] font-black">7D</span>
              </button>
              <span className={`font-mono text-[9px] mt-2.5 uppercase tracking-wide font-semibold ${activeStep === "week" ? "text-neon-cyan" : "text-slate-500"}`}>
                Last Week
              </span>
            </div>

            {/* Step 2: Month */}
            <div className="flex flex-col items-center">
              <button
                id="step-node-month"
                type="button"
                onClick={() => handleStepSelect("month")}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer z-10 ${
                  activeStep === "month"
                    ? "bg-slate-950 border-neon-cyan text-neon-cyan shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                    : "bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800"
                }`}
              >
                <span className="font-mono text-[10.5px] font-black">30D</span>
              </button>
              <span className={`font-mono text-[9px] mt-2.5 uppercase tracking-wide font-semibold ${activeStep === "month" ? "text-neon-cyan" : "text-slate-500"}`}>
                Last Month
              </span>
            </div>

            {/* Step 3: Year */}
            <div className="flex flex-col items-center">
              <button
                id="step-node-year"
                type="button"
                onClick={() => handleStepSelect("year")}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer z-10 ${
                  activeStep === "year"
                    ? "bg-slate-950 border-neon-cyan text-neon-cyan shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                    : "bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800"
                }`}
              >
                <span className="font-mono text-[10.5px] font-black">1Y</span>
              </button>
              <span className={`font-mono text-[9px] mt-2.5 uppercase tracking-wide font-semibold ${activeStep === "year" ? "text-neon-cyan" : "text-slate-500"}`}>
                Last Year
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Main output view content splitting */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Dynamic statistics and wellness trend line charts vector */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard glowColor="none" hoverable={false} className="p-5">
            <div className="border-b border-slate-900 pb-2 flex items-center justify-between">
              <span className="font-mono text-[8.5px] text-slate-500 uppercase tracking-widest font-bold">
                HISTORICAL_WAVE_TRENDS
              </span>
              <span className="font-mono text-[9.5px] text-neon-cyan font-bold">{activeData.rangeLabel}</span>
            </div>

            {/* Trend Summary Metric Grid */}
            <div className="grid grid-cols-2 gap-4 mt-4 leading-none">
              <div className="bg-slate-950/60 border border-slate-900 p-3.5 rounded-xl flex items-center gap-3">
                <Activity className="w-5 h-5 text-neon-cyan shrink-0 animate-pulse" />
                <div>
                  <span className="text-[7.5px] font-mono block text-slate-500 uppercase tracking-wider">Avg Coherence</span>
                  <strong className="text-sm font-display text-white mt-1 block">{activeData.averageCoherence}</strong>
                </div>
              </div>
              
              <div className="bg-slate-950/60 border border-slate-900 p-3.5 rounded-xl flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-neon-blue shrink-0" />
                <div>
                  <span className="text-[7.5px] font-mono block text-slate-500 uppercase tracking-wider">Ledger Handshakes</span>
                  <strong className="text-sm font-display text-white mt-1 block">{activeData.ledgerNodes}</strong>
                </div>
              </div>
            </div>

            {/* Simulated Live Vector Path Trend Area Chart */}
            <div className="mt-5 bg-slate-950/90 border border-slate-900 rounded-xl p-4.5">
              <h4 className="text-[9px] font-mono font-bold text-slate-400 mb-2 uppercase">Autonomic Autoregulation Graph</h4>
              
              <div className="h-32 w-full mt-2 relative">
                {/* Horizontal grid lines */}
                <div className="absolute inset-x-0 top-0 border-t border-slate-900/60" />
                <div className="absolute inset-x-0 top-1/3 border-t border-slate-900/40" />
                <div className="absolute inset-x-0 top-2/3 border-t border-slate-900/30" />
                <div className="absolute inset-x-0 bottom-0 border-t border-slate-900" />
                
                {/* Embedded SVG chart path */}
                <svg className="w-full h-full" viewBox="0 0 600 150" type="svg">
                  {/* Glowing shadow clip-path gradient */}
                  <defs>
                    <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Shaded Area area block */}
                  <motion.path
                    key={`area-${activeStep}`}
                    initial={{ d: "M0,150 L600,150", opacity: 0 }}
                    animate={{ d: activeData.svgChartPath + " L600,150 L0,150 Z", opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    fill="url(#chart-glow)"
                  />

                  {/* Core stroke trend path */}
                  <motion.path
                    key={`stroke-${activeStep}`}
                    initial={{ d: "M0,110 L600,110", pathLength: 0 }}
                    animate={{ d: activeData.svgChartPath, pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    fill="transparent"
                    stroke="#00f0ff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Chart footer tags */}
              <div className="flex justify-between font-mono text-[8.5px] mt-3.5 text-slate-500">
                <span>EPOCH_INDEX_START</span>
                <span>HARMONIC_BALANCE_STYLUS</span>
                <span>EPOCH_INDEX_END</span>
              </div>
            </div>

            {/* Static Vitals macro explanatory textual paragraph */}
            <p className="mt-4 font-mono text-[10px] text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-900 leading-relaxed italic">
              " {activeData.vitalsSummary} "
            </p>
          </GlassCard>
        </div>

        {/* Right column: Dynamic Historic logs milestones list */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard glowColor="none" hoverable={false} className="p-5 flex-1">
            <h4 className="font-display font-medium text-xs text-white border-b border-slate-900 pb-2.5 mb-4">
              Diagnostic Encounters & Milestones
            </h4>

            <div className="space-y-4">
              {activeData.milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-950/60 border border-slate-900/60 rounded-xl hover:border-slate-800 transition-all space-y-2.5"
                >
                  <div className="flex justify-between items-start leading-none gap-2">
                    <span className="font-mono text-[9px] text-slate-500 font-bold block">{milestone.date}</span>
                    <span className="font-mono text-[8.5px] text-neon-blue bg-neon-blue/10 border border-neon-blue/20 px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">
                      {milestone.category}
                    </span>
                  </div>

                  <div className="font-display">
                    <h5 className="text-xs font-bold text-slate-200">{milestone.title}</h5>
                    <p className="text-[10px] text-slate-500 leading-normal mt-1 font-mono">
                      {milestone.description}
                    </p>
                  </div>

                  <div className="flex justify-between border-t border-slate-900/50 pt-3 text-[9px] font-mono text-slate-500">
                    <div className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Facility Node: <strong className="text-slate-400 font-medium">{milestone.facility}</strong></span>
                    </div>
                    <span>Vault Efficiency: <strong className="text-neon-cyan">{milestone.efficiencyScore}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
