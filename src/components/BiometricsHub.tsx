/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";
import { BiometricStream } from "../types";
import { Activity, Radio, ShieldCheck, Thermometer, Droplet } from "lucide-react";

interface BiometricsHubProps {
  currentVitals: BiometricStream;
  healthScore: number;
}

export default function BiometricsHub({ currentVitals, healthScore }: BiometricsHubProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataPointsRef = useRef<number[]>([]);

  // Collect neural coherence brainwave frequency coordinates for scrolling sparkline
  useEffect(() => {
    dataPointsRef.current.push(currentVitals.neuralCoherence);
    if (dataPointsRef.current.length > 50) {
      dataPointsRef.current.shift();
    }
  }, [currentVitals.neuralCoherence]);

  // Feed continuous rendering loop for neural frequency wave spark canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle background grid lines
      ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 15) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw spark line path
      const points = dataPointsRef.current;
      if (points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(0, 240, 255, 0.5)";

      const paddingX = canvas.width / (points.length - 1);
      
      // Map min/max points to fit canvas scale perfectly
      const minVal = 30;
      const maxVal = 50;

      for (let i = 0; i < points.length; i++) {
        const x = i * paddingX;
        // Inverse Y coordinate
        const normed = (points[i] - minVal) / (maxVal - minVal);
        const y = canvas.height - 10 - normed * (canvas.height - 20);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw glowing end dot
      if (points.length > 0) {
        const lastIdx = points.length - 1;
        const x = lastIdx * paddingX;
        const normed = (points[lastIdx] - minVal) / (maxVal - minVal);
        const y = canvas.height - 10 - normed * (canvas.height - 20);

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.strokeStyle = "#00ff7f";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Reset shadows
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div id="biometrics-hub-panel" className="w-full flex flex-col gap-4">
      {/* Dynamic Health Score Metric Indicator Header */}
      <div className="w-full glass-panel-heavy rounded-2xl p-5 border border-neon-cyan/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-36 h-36 bg-neon-cyan/5 rounded-full blur-[40px] pointer-events-none" />
        <div className="absolute inset-0 cyber-dot-grid opacity-20 pointer-events-none" />
        
        <div className="flex items-center justify-between gap-4 z-10 relative">
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <ShieldCheck className="w-4 h-4 text-neon-green" />
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">SOVEREIGN_COHERENCE_INDEX</span>
            </div>
            <h3 className="font-display text-lg font-bold text-white leading-tight">Patient Genome Harmony</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">Dynamic bio-telemetry processing. High scores demonstrate balanced neurotransmission and organelle cellular synchrony.</p>
          </div>
          
          <div className="text-right flex flex-col items-end">
            <div className="relative flex items-center justify-center w-20 h-20">
              {/* Radial Progress Track Ring */}
              <svg className="absolute w-20 h-20 -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-slate-800"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-neon-cyan animate-pulse"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={213.6}
                  strokeDashoffset={213.6 - (213.6 * healthScore) / 100}
                />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold font-mono text-white leading-none">{healthScore}</span>
                <span className="text-[7px] font-semibold text-neon-cyan font-mono tracking-widest mt-0.5">SCORE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Biometric Vitals Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden flex flex-col justify-between h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider">HEART_STABILIZER</span>
            <Activity className="w-4 h-4 text-neon-rose text-opacity-80 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">
              {currentVitals.heartRate} <span className="text-xs text-slate-400">BPM</span>
            </div>
            <div className="text-[9px] font-mono text-slate-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> Live ECG Sync
            </div>
          </div>
        </div>

        {/* Oxygen level */}
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden flex flex-col justify-between h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider">PULSE_OX</span>
            <Radio className="w-4 h-4 text-neon-blue text-opacity-80 animate-ping" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">
              {currentVitals.bloodOxygen} <span className="text-xs text-slate-400">%</span>
            </div>
            <div className="text-[9px] font-mono text-slate-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" /> SpO2 Nominal
            </div>
          </div>
        </div>

        {/* Continuous glucose tracker */}
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden flex flex-col justify-between h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider">METABOLIC_CGM</span>
            <Droplet className="w-4 h-4 text-neon-green text-opacity-80" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">
              {currentVitals.bloodGlucose} <span className="text-xs text-slate-400">mg/dL</span>
            </div>
            <div className="text-[9px] font-mono text-slate-400 mt-1 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${currentVitals.bloodGlucose > 115 ? "bg-neon-green" : "bg-neon-cyan"}`} /> CG-Sensors Active
            </div>
          </div>
        </div>

        {/* Body Temperature */}
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden flex flex-col justify-between h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider">CELLULAR_TEMP</span>
            <Thermometer className="w-4 h-4 text-neon-purple text-opacity-80" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">
              {currentVitals.bodyTemp} <span className="text-xs text-slate-400">°C</span>
            </div>
            <div className="text-[9px] font-mono text-slate-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" /> Bio-Implant Synced
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Brainwave/EEG Spectrum Coherence Realtime Signal Sparkline Graph */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold font-mono tracking-wider text-slate-300">NEURAL_GAMMA_COHERENCE_SPECTRUM</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Real-time synaptic alpha/gamma feedback telemetry. Synchronized with decentralised private ledger hash keys.</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold font-mono text-neon-cyan neon-text-cyan">{currentVitals.neuralCoherence} Hz</div>
            <div className="text-[8px] font-mono text-slate-400 tracking-widest mt-0.5 animate-pulse">GAMMA WAVE COHERENT</div>
          </div>
        </div>

        {/* Spark Canvas container */}
        <div className="w-full h-24 rounded-lg bg-cyber-dark/80 border border-slate-800 relative overflow-hidden">
          <canvas ref={canvasRef} width="600" height="96" className="w-full h-full block" />
        </div>
      </div>
    </div>
  );
}
