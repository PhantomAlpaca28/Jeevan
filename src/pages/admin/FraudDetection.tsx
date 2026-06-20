/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  Activity,
  UserCheck2,
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ArrowUpRight,
  TrendingUp,
  Fingerprint,
  RefreshCw,
  EyeOff,
  Skull
} from "lucide-react";
import GlassCard from "../../components/GlassCard";

interface FraudFlag {
  id: string;
  sourceNode: string;
  nodeType: "INSURANCE" | "CLINIC" | "PHARMACY" | "BROKER";
  flaggedAction: string;
  riskSeverity: "HIGH" | "CRITICAL" | "MEDIUM";
  riskDescription: string;
  timestamp: string;
  correlationCoeff: number; // e.g. 0.88 correlation risk ratio
}

const INITIAL_FLAGS: FraudFlag[] = [
  {
    id: "flag_401",
    sourceNode: "Apex Health Underwriters LLC",
    nodeType: "INSURANCE",
    flaggedAction: "Bulk correlation search query index match request",
    riskSeverity: "CRITICAL",
    riskDescription: "Attempted to dynamically link client sequence IDs with secondary open genealogy profiles to re-engineer dynamic premium multipliers.",
    timestamp: "8 mins ago",
    correlationCoeff: 0.94
  },
  {
    id: "flag_402",
    sourceNode: "BioLabs-Direct Inc Diagnostics",
    nodeType: "BROKER",
    flaggedAction: "Unauthorized raw structural synapsis data egress",
    riskSeverity: "HIGH",
    riskDescription: "Encrypted handshake requested raw imaging matrices instead of standard downsampled diagnostic summary clusters.",
    timestamp: "1 hour ago",
    correlationCoeff: 0.81
  },
  {
    id: "flag_403",
    sourceNode: "NovaLife Pharmacy Center 4",
    nodeType: "PHARMACY",
    flaggedAction: "Double-handshake dispense request created",
    riskSeverity: "MEDIUM",
    riskDescription: "Identified two concurrent verification keys presenting identical doctor consent signatures within a 30-second window loop.",
    timestamp: "3 hours ago",
    correlationCoeff: 0.58
  }
];

export default function FraudDetection() {
  const [flags, setFlags] = useState<FraudFlag[]>(INITIAL_FLAGS);
  const [selectedFlag, setSelectedFlag] = useState<FraudFlag | null>(INITIAL_FLAGS[0]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgressText, setAuditProgressText] = useState("");
  const [networkScore, setNetworkScore] = useState(98.4);
  const [activeAdminsTotal, setActiveAdminsTotal] = useState(4);
  
  const [sentinelLogs, setSentinelLogs] = useState<string[]>([
    "SENTINEL: Port check complete. All client envelope vaults sealed.",
    "SENTINEL: Dynamic Pricing Analytics blocked from sovereign ledger handshakes.",
    "SENTINEL: Initialized security scan audit."
  ]);

  const handleDeepSecurityAudit = async () => {
    setIsAuditing(true);
    setAuditProgressText("Polling validator ledger nodes...");
    await new Promise((r) => setTimeout(r, 600));

    setAuditProgressText("Re-encrypting sovereign gateway membrane connections...");
    await new Promise((r) => setTimeout(r, 700));

    setAuditProgressText("Inspecting suspect insurance brokerage query matrices...");
    await new Promise((r) => setTimeout(r, 600));

    // Dynamic state update after evaluation
    setNetworkScore(99.6);
    setActiveAdminsTotal(0); // resolved active suspicious flags
    setFlags([]); // reset flags simulating full resolution
    setSelectedFlag(null);
    
    setSentinelLogs((prev) => [
      "LEDGER_RESOLVER: Absolute database integrity validated at 99.6% limit.",
      "SENTINEL: Apex Health Underwriters node ban signed and propagated to global transit bridges.",
      ...prev
    ]);

    setIsAuditing(false);
  };

  const handleRestrictNode = (flagId: string) => {
    // Revoke list / restriction
    setFlags((prev) => prev.filter((f) => f.id !== flagId));
    setSentinelLogs((prev) => [
      `CORRELATION_RESCINDED: Retrenched authorization for node with transaction index ${flagId}.`,
      ...prev
    ]);
    setSelectedFlag(null);
  };

  return (
    <div id="enterprise-fraud-detection" className="space-y-6 select-text text-slate-100">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 leading-none">
        {/* Metric 1 */}
        <GlassCard glowColor="none" hoverable={false} className="p-4 bg-slate-950/40">
          <span className="text-[7.5px] font-mono block text-slate-500 uppercase tracking-widest leading-none font-bold">Network Security Index</span>
          <div className="flex items-baseline gap-2 mt-2 leading-none">
            <strong className="text-xl font-display text-white">{networkScore}%</strong>
            <span className="text-[8px] text-neon-green font-mono font-bold leading-none">EXCELLENT</span>
          </div>
        </GlassCard>

        {/* Metric 2 */}
        <GlassCard glowColor="none" hoverable={false} className="p-4 bg-slate-950/40">
          <span className="text-[7.5px] font-mono block text-slate-500 uppercase tracking-widest leading-none font-bold">Blocked Handshakes</span>
          <div className="flex items-baseline gap-2 mt-2 leading-none">
            <strong className="text-xl font-display text-neon-purple">1,408</strong>
            <span className="text-[8px] text-neon-purple font-mono font-bold leading-none">+12.4%</span>
          </div>
        </GlassCard>

        {/* Metric 3 */}
        <GlassCard glowColor="none" hoverable={false} className="p-4 bg-slate-950/40 col-auto">
          <span className="text-[7.5px] font-mono block text-slate-500 uppercase tracking-widest leading-none font-bold">Active Suspect Flags</span>
          <div className="flex items-baseline gap-2 mt-2 leading-none">
            <strong className={`text-xl font-display ${activeAdminsTotal > 0 ? "text-red-400 animate-pulse" : "text-neon-cyan"}`}>
              {flags.length}
            </strong>
            <span className="text-[8px] text-slate-400 font-mono font-bold leading-none">THREAT_LEVEL_LO</span>
          </div>
        </GlassCard>

        {/* Metric 4 */}
        <GlassCard glowColor="none" hoverable={false} className="p-4 bg-slate-950/40">
          <span className="text-[7.5px] font-mono block text-slate-500 uppercase tracking-widest leading-none font-bold">Sentinel Gateways</span>
          <div className="flex items-baseline gap-2 mt-2 leading-none">
            <strong className="text-xl font-display text-white">128</strong>
            <span className="text-[8px] text-neon-cyan font-mono font-bold leading-none">ONLINE</span>
          </div>
        </GlassCard>
      </div>

      {/* Main Panel grid layout splitting */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Security scores bar chart and insurance threat flags */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard glowColor="none" hoverable={false} className="p-5.5 bg-slate-950/40">
            <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display font-medium text-sm text-white">Sovereign Incidents & Alerts</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Identified correlation and data leakage flags across participating networks.</p>
              </div>
              
              <button
                id="deep-audit-trigger-btn"
                onClick={handleDeepSecurityAudit}
                disabled={isAuditing}
                className="px-4 py-1.5 rounded-lg bg-slate-950 border border-slate-900 hover:border-slate-800 text-neon-cyan font-mono text-[9px] uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
              >
                <RefreshCw className={`w-3 h-3 ${isAuditing ? "animate-spin" : ""}`} />
                {isAuditing ? "Audit Running..." : "Execute Global Audit"}
              </button>
            </div>

            {/* Deep Audit Loader progress block */}
            <AnimatePresence>
              {isAuditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0 }}
                  className="mt-3.5 p-3.5 bg-slate-950 border border-neon-cyan/20 rounded-xl space-y-2.5"
                >
                  <div className="flex items-center gap-2 font-mono text-[9.5px] text-neon-cyan font-bold leading-none">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    <span>AUDIT_PROTOCOL_IN_PROGRESS</span>
                  </div>
                  <p className="text-[9.5px] font-mono text-slate-400 font-bold tracking-tight animate-pulse">{auditProgressText}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suspect threat list */}
            <div className="space-y-3 mt-5">
              {flags.length === 0 ? (
                <div className="text-center py-10 font-mono text-xs text-neon-green bg-neon-green/5 rounded-xl border border-neon-green/20">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-neon-green" />
                  LEDGER NODE SAFETY: All network indicators within acceptable bounds.
                </div>
              ) : (
                flags.map((flag) => {
                  const isSelected = selectedFlag?.id === flag.id;
                  return (
                    <div
                      id={`fraud-item-${flag.id}`}
                      key={flag.id}
                      onClick={() => setSelectedFlag(flag)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? "bg-slate-950/95 border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                          : "bg-slate-950/30 border-slate-900/60 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 pr-4">
                          <div className="flex items-center gap-2 leading-none">
                            <span className="font-mono text-[8px] uppercase font-black text-slate-500 tracking-wider">
                              CORRELATION_ALARM
                            </span>
                            <span className={`text-[8px] font-mono font-bold uppercase ${
                              flag.riskSeverity === "CRITICAL"
                                ? "text-red-400"
                                : "text-neon-purple"
                            }`}>
                              {flag.riskSeverity}
                            </span>
                          </div>
                          
                          <h4 className="text-xs font-bold text-slate-200 mt-1">{flag.sourceNode}</h4>
                          <span className="font-mono text-[9px] text-slate-400 block truncate leading-none mt-1">
                            {flag.flaggedAction}
                          </span>
                        </div>

                        {/* Coeff score gauge */}
                        <div className="text-right flex flex-col items-end shrink-0">
                          <span className="font-mono text-[10px] text-red-400 font-bold">
                            {(flag.correlationCoeff * 100).toFixed(0)}% Threat Coeff
                          </span>
                          <span className="font-thin text-[8.5px] text-slate-500 font-mono block mt-1.5">{flag.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Custom SVG Bar Chart of daily incident threat spikes */}
            <div className="mt-6 bg-slate-950/80 border border-slate-900 rounded-xl p-4.5">
              <div className="flex items-center justify-between mb-3 leading-none">
                <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase">Weekly Incident Density Profile</h4>
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
                  <TrendingUp className="w-3.5 h-3.5 fill-current text-red-500/50" />
                  <span>Threat Waves Peak On Wed/Fri</span>
                </div>
              </div>

              {/* Bar charts vector rendering */}
              <div className="h-20 flex items-end justify-between gap-2 px-1 relative">
                {/* Threat thresholds lines */}
                <div className="absolute inset-x-0 bottom-1/2 border-b border-dashed border-red-500/10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-3/4 border-b border-dashed border-red-500/20 pointer-events-none" />
                
                {[
                  { day: "Mon", count: 12, height: "15%" },
                  { day: "Tue", count: 24, height: "30%" },
                  { day: "Wed", count: 78, height: "78%" },
                  { day: "Thu", count: 42, height: "45%" },
                  { day: "Fri", count: 91, height: "91%" },
                  { day: "Sat", count: 15, height: "20%" },
                  { day: "Sun", count: 8, height: "10%" }
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[7.5px] font-mono text-slate-500 leading-none">{bar.count}</span>
                    <div
                      className={`w-full rounded-sm leading-none transition-all ${
                        bar.count > 60
                          ? "bg-gradient-to-t from-red-600 to-red-400 shadow-[0_0_8px_rgba(239,68,68,0.25)]"
                          : "bg-slate-800 hover:bg-slate-700"
                      }`}
                      style={{ height: bar.height }}
                    />
                    <span className="text-[8px] font-mono text-slate-500 tracking-wide font-bold uppercase">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right column: Incident Action & Audit Logs */}
        <div className="lg:col-span-5 space-y-6">
          {selectedFlag ? (
            <GlassCard glowColor="purple" hoverable={false} className="p-6">
              <div className="border-b border-slate-900 pb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <h4 className="font-display font-medium text-xs text-white">Insurer Correlation Threat</h4>
                  <span className="font-mono text-[8.5px] text-slate-500 uppercase tracking-widest">{selectedFlag.id}</span>
                </div>
              </div>

              <div className="mt-5 space-y-4 font-mono text-[10.5px]">
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-900/60 leading-relaxed text-slate-400">
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase font-bold block leading-none mb-1">SUSPECT_GATEWAY_NODE</span>
                    <strong className="text-white font-bold block">{selectedFlag.sourceNode}</strong>
                    <span className="text-[8.5px] bg-slate-950 text-slate-500 border border-slate-900 px-1.5 py-0.25 rounded uppercase mt-1 inline-block leading-none font-bold">
                      NODE_TYPE_TYPE: {selectedFlag.nodeType}
                    </span>
                  </div>

                  <div className="border-t border-slate-900/60 pt-3">
                    <span className="text-[8px] text-slate-500 uppercase font-bold block leading-none mb-1">FLAGGED_ACTION_METADATA</span>
                    <p className="text-slate-300 font-semibold">{selectedFlag.flaggedAction}</p>
                  </div>

                  <div className="border-t border-slate-900/60 pt-3">
                    <span className="text-[8px] text-slate-500 uppercase font-bold block leading-none mb-1">RISK_REASON_ANALYSIS</span>
                    <p className="text-red-400 leading-normal italic text-[10px] bg-red-950/15 p-2 rounded.md border border-red-900/20">{selectedFlag.riskDescription}</p>
                  </div>

                  <div className="border-t border-slate-900/60 pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase font-bold block leading-none">TIME_STAMP</span>
                      <strong className="text-slate-400 block font-semibold mt-1">{selectedFlag.timestamp}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-slate-500 uppercase font-bold block leading-none font-bold">Correlation Coeff</span>
                      <strong className="text-red-400 block font-bold mt-1 text-[11px]">
                        {(selectedFlag.correlationCoeff * 10).toFixed(2)} / 10.0
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Restrict / Blacklist Controls */}
                <div className="flex gap-2">
                  <button
                    id="revoke-flag-node-btn"
                    onClick={() => handleRestrictNode(selectedFlag.id)}
                    className="flex-1 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-red-900/60 text-slate-300 hover:text-red-400 transition-all font-display font-black text-xs tracking-widest cursor-pointer uppercase text-center"
                  >
                    Restrict Node Pipeline
                  </button>

                  <button
                    id="ban-suspect-direct-btn"
                    onClick={() => {
                      // Simulates direct blacklisting
                      handleRestrictNode(selectedFlag.id);
                    }}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-[#b50000] text-white font-display font-black text-xs tracking-widest hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all cursor-pointer uppercase flex items-center justify-center gap-1.5"
                  >
                    <Skull className="w-3.5 h-3.5" /> Blacklist Node
                  </button>
                </div>
              </div>
            </GlassCard>
          ) : (
            <div className="text-center py-12 font-mono text-xs text-slate-500">
              Select an incident threat flag from the alerts panel to inspect correlation metrics.
            </div>
          )}

          {/* Sentinel Logs Terminal box */}
          <GlassCard glowColor="none" hoverable={false} className="p-4 bg-slate-950/80 leading-normal text-[9.5px]">
            <h4 className="font-mono text-[8.5px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1.5 mb-2.5">
              Sentinel Decayed Core Logs
            </h4>
            
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin select-text">
              {sentinelLogs.map((log, idx) => (
                <div key={idx} className="font-mono text-slate-400 flex items-start gap-1.5 leading-relaxed text-[9px]">
                  <span className="text-slate-600 shrink-0">[{idx}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
