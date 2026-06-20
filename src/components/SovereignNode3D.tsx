/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ShieldCheck, Cpu, Activity, User, Heart, Compass, CheckCircle } from "lucide-react";

// Import the generated premium 3D digital human body model asset
// @ts-ignore
import twinModelImg from "../assets/images/3d_digital_twin_body_1781988014271.jpg";

interface SovereignNode3DProps {
  neuralHz?: number;
  heartRate?: number;
}

export default function SovereignNode3D({ neuralHz = 40, heartRate = 72 }: SovereignNode3DProps) {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  // Dynamic system health statuses matching mockup
  const systems = [
    { name: "Heart", status: "Healthy", desc: "Stable ECG", color: "text-emerald-400" },
    { name: "Brain", status: "Optimal", desc: "40 Hz Alpha-Resonance", color: "text-emerald-400" },
    { name: "Lungs", status: "Healthy", desc: "98% Blood Saturation", color: "text-emerald-400" },
    { name: "Liver", status: "Normal", desc: "Metabolic Synthesis", color: "text-emerald-400" },
    { name: "Immunity", status: "Strong", desc: "No conflict triggers", color: "text-emerald-400" },
    { name: "Metabolism", status: "Balanced", desc: "CG-Sensors stabilized", color: "text-emerald-400" },
  ];

  return (
    <div id="vortex-neural-cell" className="relative w-full rounded-2xl bg-[#040c16]/90 border border-slate-900 overflow-hidden flex flex-col p-6 hover:border-emerald-500/10 transition-all shadow-xl">
      {/* Background design elements */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 cyber-dot-grid opacity-15 pointer-events-none" />

      {/* Title block */}
      <div className="flex items-center justify-between mb-5 z-10">
        <div>
          <h3 className="font-display font-medium text-xs tracking-widest text-slate-500 uppercase leading-none">YOUR DIGITAL TWIN</h3>
          <p className="text-xs text-slate-400 font-sans tracking-wide mt-1">Real-time Personalized Health Model</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] font-semibold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>TWIN STATUS: LIVE</span>
        </div>
      </div>

      {/* Main Core Body Layout */}
      <div className="grid grid-cols-12 gap-4 items-center flex-1 z-10">
        {/* Left Side: Systems Status Icons list matching mockup exactly */}
        <div className="col-span-3 flex flex-col gap-2.5">
          {systems.map((sys) => (
            <button
              key={sys.name}
              onClick={() => setSelectedSystem(selectedSystem === sys.name ? null : sys.name)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left border transition-all ${
                selectedSystem === sys.name
                  ? "bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.1)]"
                  : "bg-[#05111d]/50 border-slate-900/60 hover:bg-[#05111d]"
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.5)] shrink-0" />
              <div className="leading-tight overflow-hidden">
                <span className="block text-[11px] font-bold text-white leading-none">{sys.name}</span>
                <span className="block text-[9px] text-slate-400 leading-none mt-1">{sys.status}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Center: Glowing 3D Holographic human wireframe render */}
        <div className="col-span-6 flex flex-col items-center justify-center relative min-h-[240px]">
          {/* Holographic scanner halo circle base style placeholder */}
          <div className="absolute bottom-2 w-32 h-10 border-t border-emerald-500/20 rounded-full scale-y-50 rotate-[-12deg] bg-emerald-500/3 animate-pulse border-dashed flex items-center justify-center">
            <div className="w-16 h-4 border-t border-emerald-400/30 rounded-full animate-ping" />
          </div>

          <div className="relative w-44 h-56 flex items-center justify-center overflow-hidden hover:scale-[1.03] transition-all duration-500">
            {/* Real imported 3D generated human mockup */}
            <img
              src={twinModelImg}
              alt="Digital Twin Body"
              className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_20px_rgba(16,185,129,0.15)] rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Right Side Status Panel HUD matching mockup text exactly */}
        <div className="col-span-3 flex flex-col justify-center gap-4.5 pl-2">
          {/* Health Score Circular representation */}
          <div className="bg-[#05111d]/50 border border-slate-900 p-3 rounded-2xl">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block leading-none mb-2">Health Score</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-sans text-emerald-400 select-all leading-none">87</span>
              <span className="text-[11px] text-slate-500 leading-none">/100</span>
            </div>
            {/* Visual indicator bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "87%" }} />
            </div>
          </div>

          {/* Risk assessment indicator level */}
          <div className="bg-[#05111d]/50 border border-slate-900 p-3 rounded-2xl flex items-center justify-between">
            <div className="leading-tight">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block leading-none mb-1">Risk Level</span>
              <span className="text-xs font-bold text-white">Low</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          </div>

          {/* Last updated timestamp info */}
          <div className="text-[9px] font-mono text-slate-500 leading-tight">
            <span>Last Updated</span>
            <strong className="block text-slate-400 mt-0.5">10 mins ago</strong>
          </div>
        </div>
      </div>

      {/* Button: Explore My Digital Twin */}
      <button className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 hover:from-emerald-500/20 hover:to-teal-500/15 border border-emerald-500/25 hover:border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2">
        <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
        Explore My Digital Twin
      </button>
    </div>
  );
}
