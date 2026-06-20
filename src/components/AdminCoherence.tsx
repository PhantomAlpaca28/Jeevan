/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  Server,
  Activity,
  UserCheck2,
  Lock,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Gauge,
  Terminal,
  Zap,
  Globe
} from "lucide-react";
import GlassCard from "./GlassCard";

interface ValidatorNode {
  name: string;
  region: string;
  latencyMs: number;
  syncHeight: number;
  status: "ONLINE" | "SYNCING" | "ALERT";
}

export default function AdminCoherence() {
  const [validators, setValidators] = useState<ValidatorNode[]>([
    { name: "Geneva Core Validator", region: "CH-West", latencyMs: 14, syncHeight: 620491, status: "ONLINE" },
    { name: "Tokyo Synth Oracle", region: "JP-East", latencyMs: 38, syncHeight: 620491, status: "ONLINE" },
    { name: "London Transit Bridge", region: "UK-North", latencyMs: 22, syncHeight: 620491, status: "ONLINE" },
    { name: "Sovereign Self Gateway", region: "Vortexa_Local", latencyMs: 1, syncHeight: 620491, status: "ONLINE" }
  ]);

  const [firewallStrength, setFirewallStrength] = useState(99.64);
  const [totalTrafficRequests, setTotalTrafficRequests] = useState(14872);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  // Dynamic simulation updates
  useEffect(() => {
    const timer = setInterval(() => {
      setValidators((prev) =>
        prev.map((v) => {
          const latencyDrift = Math.floor((Math.random() - 0.5) * 6);
          return {
            ...v,
            latencyMs: Math.max(1, v.latencyMs + latencyDrift)
          };
        })
      );
      setFirewallStrength((f) => Math.min(100, Math.max(99.0, +(f + (Math.random() - 0.5) * 0.05).toFixed(2))));
      setTotalTrafficRequests((t) => t + Math.floor(Math.random() * 5) + 1);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const handleSweepFirewall = async () => {
    setIsAuditing(true);
    setAuditMessage(null);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setValidators((prev) =>
      prev.map((v) => ({
        ...v,
        latencyMs: Math.max(1, v.latencyMs - 4),
        status: "ONLINE"
      }))
    );
    setFirewallStrength(99.98);
    setIsAuditing(false);
    setAuditMessage("SENTINEL_SWEEP_SUCCESS: Purged raw socket logs. Intrusion defense membranes re-configured.");
  };

  return (
    <div id="admin-security-coherence" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Security Grid and sweep controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div id="admin-security-holographic-monitor" className="relative w-full h-[360px] md:h-[420px] rounded-2xl glass-panel overflow-hidden flex flex-col justify-between p-5 border border-red-500/20 bg-slate-950/20">
            <div className="absolute inset-0 cyber-dot-grid opacity-30 pointer-events-none" />

            {/* Glowing red accent membrane header */}
            <div className="z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="font-mono text-[10px] tracking-widest text-slate-400">LEDGER_PROTECTION_MATRIX</span>
              </div>
              <span className="font-mono text-[9px] text-red-400 bg-red-950/10 border border-red-900/30 px-2.5 py-0.5 rounded uppercase font-bold leading-none">
                Sentinel Online
              </span>
            </div>

            {/* Simulated Cryptographic Security Orbit map */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 rounded-full border border-dashed border-red-500/10 animate-[spin_50s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-red-500/20 animate-[spin_35s_linear_infinite_reverse]">
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                </div>
                
                {/* Visual grid pattern */}
                <div className="absolute inset-16 flex items-center justify-center">
                  <svg className="w-full h-full text-red-500/30" viewBox="0 0 100 100" type="svg">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                    <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    
                    {/* Matrix Lines */}
                    <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.4" />
                    <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.4" />
                    
                    {/* Synchrony nodes intersection plots */}
                    <path d="M25,25 L75,75 M25,75 L75,25" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 1" />

                    {/* Central Cryptographic Firewall Core */}
                    <circle cx="50" cy="50" r="10" className="fill-red-950/40 stroke-red-500 animate-pulse" strokeWidth="1.5" />
                    <polygon points="50,45 54,53 46,53" className="fill-red-400 stroke-none" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Admin Security Metrics overlay */}
            <div className="z-10 grid grid-cols-3 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-xl border border-red-900/15 gap-2.5 text-center leading-none">
              <div className="flex flex-col items-center justify-center border-r border-red-950/10">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Cpu className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-[9px] font-mono tracking-wider">FIREWALL</span>
                </div>
                <span className="text-sm font-semibold tracking-tight text-white font-mono">
                  {firewallStrength}% <span className="text-[9px] text-red-400">COH</span>
                </span>
                <div className="text-[8px] font-mono text-red-400/80 mt-0.5">Membrane Protection</div>
              </div>

              <div className="flex flex-col items-center justify-center border-r border-red-950/10 col-auto">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Activity className="w-3.5 h-3.5 text-neon-cyan" />
                  <span className="text-[9px] font-mono tracking-wider">TRAFFIC_RATE</span>
                </div>
                <span className="text-sm font-semibold tracking-tight text-white font-mono">
                  {totalTrafficRequests} <span className="text-[8px] text-neon-cyan font-semibold">REQS</span>
                </span>
                <div className="text-[8px] font-mono text-neon-cyan/80 mt-0.5">Sovereign Queries</div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Globe className="w-3.5 h-3.5 text-neon-purple" />
                  <span className="text-[9px] font-mono tracking-wider">VALIDATORS</span>
                </div>
                <span className="text-sm font-semibold tracking-tight text-slate-200 font-mono">4 / 4 OK</span>
                <div className="text-[8px] font-mono text-neon-purple/80 mt-0.5">Globally Replicated</div>
              </div>
            </div>
          </div>

          <GlassCard glowColor="none" hoverable={false} className="p-4 bg-slate-950/40">
            <h4 className="font-display font-medium text-xs text-white border-b border-slate-900 pb-2 mb-3">
              Interactive Firewall Purge Controls
            </h4>
            <p className="font-mono text-[10.5px] text-slate-400 leading-normal mb-4">
              Execute dynamic intrusion sweep sequences to flush pending connections buffer logs, analyze ledger latency thresholds, and re-authenticate active validator interfaces.
            </p>
            <div className="flex flex-col gap-3">
              <button
                id="sentinel-sweep-btn"
                onClick={handleSweepFirewall}
                disabled={isAuditing}
                className="w-full py-3 rounded-lg border border-red-500/30 text-red-400 font-mono text-[10px] uppercase font-bold tracking-wider hover:bg-red-500/10 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isAuditing ? "animate-spin" : ""}`} />
                {isAuditing ? "Performing Intrusive Sweep..." : "Execute Firewall Membrane Sweep"}
              </button>

              <AnimatePresence>
                {auditMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-red-950/10 border border-red-900/30 text-red-400 font-mono text-[9.5px] rounded-lg flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{auditMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>

        {/* Right column: Distributed consensus validator stations metrics */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <GlassCard glowColor="purple" hoverable={false} className="p-5">
            <h4 className="font-display font-medium text-xs text-white border-b border-slate-900 pb-2.5 mb-4">
              Distributed Ledger Sync Validators
            </h4>

            <div className="space-y-4">
              {validators.map((item) => (
                <div
                  key={item.name}
                  className="bg-slate-950/50 border border-slate-900/60 p-4 rounded-xl space-y-3 font-mono text-[10.5px] leading-none"
                >
                  <div className="flex justify-between items-start leading-none gap-2">
                    <div>
                      <h5 className="font-display text-xs font-bold text-slate-200 mt-1 block leading-normal">{item.name}</h5>
                      <span className="text-[8.5px] text-slate-500 mt-1 block">{item.region} station</span>
                    </div>
                    <span className="text-[8px] bg-red-500/5 border border-red-900/20 text-red-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 leading-none">
                      Latency {item.latencyMs}ms
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-slate-900/40">
                    <div>
                      <span className="text-[7.5px] text-slate-500 uppercase font-bold block tracking-wider mb-1">State Synchrony</span>
                      <strong className="text-white font-medium">{item.status}</strong>
                    </div>

                    <div>
                      <span className="text-[7.5px] text-slate-500 uppercase font-bold block tracking-wider mb-1">Block Ledger Height</span>
                      <strong className="text-slate-300 font-medium">#{item.syncHeight}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard glowColor="none" hoverable={false} className="p-4 bg-slate-950/60 leading-normal text-[10px]">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-2.5">
              <Terminal className="w-4 h-4 text-red-400" />
              <span className="font-mono text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                Cybersecurity Audit Scope
              </span>
            </div>
            <p className="font-mono text-slate-400 text-[9px] leading-relaxed">
              Consensus protocols automatically reject any ledger mutation from compromised or blocked stations. Security compliance rules are hardcoded in sovereign smart rules policies.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
