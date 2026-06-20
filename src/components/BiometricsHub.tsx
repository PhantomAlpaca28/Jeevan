/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { BiometricStream } from "../types";
import { Heart, Activity, Droplet, User, Moon, ShieldCheck, Zap } from "lucide-react";

interface BiometricsHubProps {
  currentVitals: BiometricStream;
  healthScore: number;
}

// Sparkline Component that generates gorgeous animated waves based on metric value seeds
function Sparkline({ seed, color = "#10b981" }: { seed: number; color?: string }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => prev + 0.1);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const generatePoints = () => {
    const points: string[] = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const x = (i / (count - 1)) * 120;
      // Add a dynamic wave shape based on seed and moving phase
      const y = 16 + Math.sin((i * 0.7) + phase + seed) * 5 + Math.cos((i * 0.4) - phase) * 3;
      points.push(`${x},${y}`);
    }
    return `M ${points.join(" L ")}`;
  };

  return (
    <svg className="w-24 h-8 overflow-visible" viewBox="0 0 120 32">
      <path
        d={generatePoints()}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]"
      />
    </svg>
  );
}

export default function BiometricsHub({ currentVitals, healthScore }: BiometricsHubProps) {
  // Hardcoded constant references matching patient lifestyle metrics from the mockup
  const activitySteps = 7842;
  const sleepDuration = "7h 32m";

  return (
    <div id="biometrics-hub-panel" className="w-full flex flex-col gap-6">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between pb-1">
        <h3 className="font-display font-bold text-base text-white tracking-wide uppercase flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-emerald-400" />
          HEALTH OVERVIEW
        </h3>
        <div className="flex items-center gap-2 bg-[#05111d] px-3 py-1 rounded-lg border border-slate-900 text-[10px] font-mono text-slate-400">
          <span>Today</span>
          <span className="text-[8px] text-slate-600">▼</span>
        </div>
      </div>

      {/* Grid of Biometric Vitals Dashboard Matches the design specs & colors exactly */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Heart Rate */}
        <div className="bg-[#05111d] border border-slate-900 p-4.5 rounded-2xl flex flex-col justify-between h-[135px] relative overflow-hidden group hover:border-emerald-500/20 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/10 border border-emerald-500/10 flex items-center justify-center">
              <Heart className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="block text-[11px] text-slate-400 font-sans tracking-wide leading-none">Heart Rate</span>
            <div className="flex items-baseline gap-1 mt-2 mb-1">
              <span className="text-2xl font-bold text-white tracking-tight leading-none">
                {currentVitals.heartRate}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">bpm</span>
            </div>
            <span className="text-[9px] text-emerald-400 font-semibold tracking-wide">Normal Range</span>
          </div>
          <div className="absolute right-3 bottom-4 opacity-75">
            <Sparkline seed={1.2} />
          </div>
        </div>

        {/* SpO2 */}
        <div className="bg-[#05111d] border border-slate-900 p-4.5 rounded-2xl flex flex-col justify-between h-[135px] relative overflow-hidden group hover:border-emerald-500/20 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-[#00f0ff]/5 border border-[#00f0ff]/10 flex items-center justify-center">
              <Droplet className="w-4 h-4 text-[#00f0ff]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="block text-[11px] text-slate-400 font-sans tracking-wide leading-none">SpO2</span>
            <div className="flex items-baseline gap-1 mt-2 mb-1">
              <span className="text-2xl font-bold text-white tracking-tight leading-none">
                {currentVitals.bloodOxygen}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">%</span>
            </div>
            <span className="text-[9px] text-[#00f0ff] font-semibold tracking-wide">Normal Range</span>
          </div>
          <div className="absolute right-3 bottom-4 opacity-75">
            <Sparkline seed={2.5} color="#00f0ff" />
          </div>
        </div>

        {/* Glucose */}
        <div className="bg-[#05111d] border border-slate-900 p-4.5 rounded-2xl flex flex-col justify-between h-[135px] relative overflow-hidden group hover:border-emerald-500/20 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-teal-950/10 border border-teal-500/10 flex items-center justify-center">
              <Droplet className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="block text-[11px] text-slate-400 font-sans tracking-wide leading-none">Glucose</span>
            <div className="flex items-baseline gap-1 mt-2 mb-1">
              <span className="text-2xl font-bold text-white tracking-tight leading-none">
                {currentVitals.bloodGlucose + 13}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">mg/dL</span>
            </div>
            <span className="text-[9px] text-emerald-400 font-semibold tracking-wide">Normal Range</span>
          </div>
          <div className="absolute right-3 bottom-4 opacity-75">
            <Sparkline seed={4.1} />
          </div>
        </div>

        {/* Activity */}
        <div className="bg-[#05111d] border border-slate-900 p-4.5 rounded-2xl flex flex-col justify-between h-[135px] relative overflow-hidden group hover:border-emerald-500/20 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/10 border border-emerald-500/10 flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="block text-[11px] text-slate-400 font-sans tracking-wide leading-none">Activity</span>
            <div className="flex items-baseline gap-1 mt-2 mb-1">
              <span className="text-2xl font-bold text-white tracking-tight leading-none">
                {activitySteps.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Steps</span>
            </div>
            <span className="text-[9px] text-emerald-400 font-semibold tracking-wide">Good Progress</span>
          </div>
          <div className="absolute right-3 bottom-4 opacity-75">
            <Sparkline seed={5.8} />
          </div>
        </div>

        {/* Sleep */}
        <div className="bg-[#05111d] border border-slate-900 p-4.5 rounded-2xl flex flex-col justify-between h-[135px] relative overflow-hidden group hover:border-emerald-500/20 transition-all col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-purple-950/10 border border-purple-500/10 flex items-center justify-center">
              <Moon className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="block text-[11px] text-slate-400 font-sans tracking-wide leading-none">Sleep</span>
            <div className="flex items-baseline gap-1 mt-2 mb-1">
              <span className="text-2xl font-bold text-white tracking-tight leading-none">
                {sleepDuration}
              </span>
            </div>
            <span className="text-[9px] text-purple-400 font-semibold tracking-wide">Good Quality</span>
          </div>
          <div className="absolute right-3 bottom-4 opacity-75">
            <Sparkline seed={7.2} color="#c084fc" />
          </div>
        </div>
      </div>
    </div>
  );
}
