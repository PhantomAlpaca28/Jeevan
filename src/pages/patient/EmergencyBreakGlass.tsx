/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  Flame,
  ShieldAlert,
  Terminal,
  FileCheck2,
  KeyRound,
  Lock,
  Skull,
  User,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import GlassCard from "../../components/GlassCard";

interface EmergencyBreakGlassProps {
  isEmergencyActive: boolean;
  onToggleEmergency: (active: boolean) => void;
}

export default function EmergencyBreakGlass({
  isEmergencyActive,
  onToggleEmergency
}: EmergencyBreakGlassProps) {
  const [responderName, setResponderName] = useState("Dr. Michael Stone");
  const [responderCredential, setResponderCredential] = useState("MD-998-CRITICAL-RESPONSE-EMS");
  const [justification, setJustification] = useState(
    "Patient presenting acute cardiovascular autonomic dysregulation with unmeasurable low-frequency cortical coherence waves. Handshake consent unavailable due to neuro-resilient trance coma state."
  );
  
  const [pinInput, setPinInput] = useState("");
  const [errorText, setErrorText] = useState("");
  const [auditLog, setAuditLog] = useState<{ id: string; msg: string; time: string }[]>([
    { id: "log_1", msg: "PORTAL: Passive break-glass sentinel monitoring standby", time: "09:00 UTC" }
  ]);

  const handleBreakGlass = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (!responderName.trim() || !responderCredential.trim() || !justification.trim()) {
      setErrorText("All operator fields must be signed with official ledger tags.");
      return;
    }

    if (pinInput !== "9110") {
      setErrorText("INTEGRITY ERROR: Emergency overrides require safety passcode '9110'.");
      return;
    }

    // Toggle global trigger
    onToggleEmergency(true);
    
    const newLog = {
      id: "log_" + Math.random().toString(36).substring(2, 6),
      msg: `SIREN OVERRIDE: Responded by md:${responderName} [${responderCredential}]. Reason: ${justification.substring(0, 60)}...`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setAuditLog((prev) => [newLog, ...prev]);
  };

  const handleRestoreNormal = () => {
    onToggleEmergency(false);
    setPinInput("");
    
    const restoreLog = {
      id: "log_" + Math.random().toString(36).substring(2, 6),
      msg: "SENTINEL: Glass gate resealed. Standard client ledger governance active.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setAuditLog((prev) => [restoreLog, ...prev]);
  };

  return (
    <div id="break-glass-portal" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Input Override triggers and forms */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard
            glowColor={isEmergencyActive ? "purple" : "none"}
            hoverable={false}
            className={`p-6 transition-all ${
              isEmergencyActive
                ? "bg-red-950/20 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.2)] animate-pulse"
                : "bg-slate-950/40"
            }`}
          >
            {/* Searing warning card head */}
            <div className="border-b border-slate-900 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isEmergencyActive ? "bg-red-500 text-white animate-bounce" : "bg-red-950/20 text-red-400"}`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">Break-Glass Portal</h3>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">Audited high-privilege emergency telemetry bypass network.</p>
                </div>
              </div>

              <span className={`font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                isEmergencyActive ? "bg-red-500 text-white animate-pulse" : "bg-slate-950 text-slate-500 border border-slate-900"
              }`}>
                {isEmergencyActive ? "WARNING_OVERRIDE_ACTIVE" : "STANDBY_SEALED"}
              </span>
            </div>

            {isEmergencyActive ? (
              // Active Emergency override console UI
              <div className="space-y-5 mt-6">
                <div className="bg-red-950/25 p-4 rounded-xl border border-red-500/40 flex items-start gap-3 text-red-200">
                  <Flame className="w-5 h-5 shrink-0 mt-0.5 animate-pulse text-red-400" />
                  <div className="leading-tight text-xs">
                    <strong className="block text-red-400 font-bold uppercase tracking-wider">CRITICAL DATA BYPASS ENGAGED</strong>
                    <p className="text-slate-300 mt-1 font-mono leading-relaxed text-[11px]">
                      A digital glass-break signal has been signed and broadcast to our decentralized audits network. The patient's telemetry limits have been disabled for emergency diagnosis. Every action is logged on the public block ledger.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="font-mono text-[9px] text-slate-500 block uppercase tracking-wider font-bold">ACTIVE_RESPONDER_IDENTITY</span>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 leading-relaxed font-mono text-[10px]">
                    <div className="grid grid-cols-2 gap-3 mb-2.5 text-slate-400">
                      <div>
                        <span className="text-slate-500 block text-[8px] uppercase font-bold text-slate-500">RES_PHYSICIAN</span>
                        <strong className="text-white block mt-0.5">{responderName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[8px] uppercase font-bold text-slate-500">CREDENTIAL_TAG</span>
                        <strong className="text-white block mt-0.5">{responderCredential}</strong>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px] uppercase font-bold text-slate-500">DECLARED_JUSTIFICATION</span>
                      <p className="text-red-400 italic mt-0.5 leading-normal text-[10px] bg-red-950/10 p-2 rounded border border-red-900/20">{justification}</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  id="restore-governance-btn"
                  onClick={handleRestoreNormal}
                  className="w-full py-3 rounded-xl bg-slate-950 border border-slate-900 hover:border-slate-700 text-slate-300 hover:text-white font-display font-black text-xs tracking-widest transition-all cursor-pointer uppercase mt-2"
                >
                  Terminate Override & Reseal Glass Gate
                </button>
              </div>
            ) : (
              // Inactive trigger form
              <form onSubmit={handleBreakGlass} className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10.5px] text-slate-400 uppercase tracking-wide">Emergency Responder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Michael Stone"
                      value={responderName}
                      onChange={(e) => setResponderName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-red-500 transition-all font-semibold"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10.5px] text-slate-400 uppercase tracking-wide">Clinical Credential Tag ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EMS-911-RESCUE"
                      value={responderCredential}
                      onChange={(e) => setResponderCredential(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-red-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10.5px] text-slate-400 uppercase tracking-wide">Official Emergency Justification</label>
                  <textarea
                    required
                    rows={3}
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-red-500 transition-all resize-none leading-relaxed italic"
                  />
                </div>

                <div className="border-t border-slate-900 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1 sm:w-60">
                    <label className="font-mono text-[10px] text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-red-400 animate-pulse" /> Confirm Overlay PIN (Type "9110")
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter safety PIN (9110)"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 font-mono text-center text-xs tracking-widest text-white focus:outline-none focus:border-red-500 font-black"
                    />
                  </div>

                  <button
                    type="submit"
                    id="break-glass-submit-btn"
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-red-600 to-[#d00000] text-white font-display font-black text-xs tracking-widest hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all cursor-pointer uppercase flex items-center justify-center gap-2"
                  >
                    <Flame className="w-4 h-4 animate-pulse" /> BREAK GLASS IMMINENT
                  </button>
                </div>

                {errorText && (
                  <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 font-mono text-[10px] rounded-lg mt-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorText}</span>
                  </div>
                )}
              </form>
            )}
          </GlassCard>
        </div>

        {/* Right Column: Simulated immutable telemetry logs of override events */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard glowColor="none" hoverable={false} className="p-5">
            <div className="border-b border-slate-900 pb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-500" />
              <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">Sovereign Override Ledger</span>
            </div>

            <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {auditLog.map((log) => (
                <div key={log.id} className="bg-slate-950 p-3 rounded-lg border border-slate-900/80 font-mono text-[10px] leading-relaxed flex flex-col gap-1">
                  <div className="flex justify-between text-slate-500 text-[8px] leading-none mb-1">
                    <span className="font-bold">BLOCK_EVENT</span>
                    <span>{log.time}</span>
                  </div>
                  <p className="text-slate-300 font-mono whitespace-pre-wrap">{log.msg}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
