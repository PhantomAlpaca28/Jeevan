/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Network, Lock, Fingerprint, Sparkles, AlertTriangle } from "lucide-react";
import GlassCard from "../components/GlassCard";
import BackgroundVideo from "../components/BackgroundVideo";

export type UserRole = "PATIENT" | "DOCTOR" | "PHARMACIST" | "ADMIN";

interface LoginProps {
  onLogin: (role: UserRole, userDid: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("PATIENT");
  const [isScanning, setIsScanning] = useState(false);
  const [customDid, setCustomDid] = useState("did:vitaltwin:ipns:8f2a9e31dcdc6bf71b4eef2");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "INITIATOR: Handshake requesting secure workspace socket...",
    "HANDSHAKE: TLS_AES_256_GCM_SHA384 active.",
  ]);

  const addLog = (log: string) => {
    setTerminalLogs((prev) => [...prev, log]);
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "PATIENT") {
      setCustomDid("did:vitaltwin:ipns:8f2a9e31dcdc6bf71b4eef2");
      addLog("CONFIG: Role selection updated to Sovereign Patient Node.");
    } else if (role === "DOCTOR") {
      setCustomDid("did:vitaltwin:operator:doc_9031ef09cda81");
      addLog("CONFIG: Role selection updated to Operator Clinical Node.");
    } else if (role === "PHARMACIST") {
      setCustomDid("did:vitaltwin:operator:phr_2289bcf2ad31e");
      addLog("CONFIG: Role selection updated to Operator Pharmaceutical Node.");
    } else {
      setCustomDid("did:vitaltwin:admin:sec_77ad0a01ee8cf");
      addLog("CONFIG: Role selection updated to Network Cybersecurity Admin Node.");
    }
  };

  const startSecureScan = async () => {
    setIsScanning(true);
    addLog("CHALLENGE: Sending zero-knowledge cryptographic authentication challenge...");
    
    await new Promise((r) => setTimeout(r, 800));
    addLog("SYNAPSE_SCAN: Measuring brainwave resonance coherence (40Hz Gamma)...");
    
    await new Promise((r) => setTimeout(r, 800));
    addLog("BIOMETRICS: Retinal-fingerprint hashing index matching sovereign ledger keys...");
    
    await new Promise((r) => setTimeout(r, 600));
    addLog("GRANTS: Certificate signed. Workspace authorization credentials unlocked.");
    
    await new Promise((r) => setTimeout(r, 450));
    setIsScanning(false);
    onLogin(selectedRole, customDid);
  };

  return (
    <div id="vitaltwin-login-container" className="min-h-screen bg-slate-950/60 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Loop Video Layer */}
      <BackgroundVideo opacity={0.5} />

      {/* Visual cyber overlays */}
      <div className="absolute inset-0 scanlines pointer-events-none z-10 opacity-30" />
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Login Display Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 15 }}
        className="w-full max-w-lg z-20"
      >
        <GlassCard glowColor="cyan" hoverable={false} className="p-8">
          {/* Logo & Headline */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-blue p-0.5 shadow-[0_0_25px_rgba(0,240,255,0.25)] mb-4">
              <div className="w-full h-full bg-cyber-dark rounded-[14px] flex items-center justify-center">
                <Network className="w-7 h-7 text-neon-cyan animate-pulse" />
              </div>
            </div>
            <h2 className="font-display font-black text-3xl tracking-tight text-white leading-tight">VITAL TWIN</h2>
            <p className="text-xs text-neon-cyan font-bold tracking-widest mt-1 font-mono uppercase">Sovereign Healthcare Intelligence Network</p>
          </div>

          {/* Role selector panel */}
          <div className="mb-6 flex flex-col gap-2">
            <label className="font-mono text-[10px] text-slate-500 tracking-wider">CHOOSE ACCESS AUTHORIZATION LAYER</label>
            <div className="grid grid-cols-4 bg-slate-950 p-1.5 rounded-xl border border-slate-900 gap-1.5 text-center font-mono text-[9px]">
              {(["PATIENT", "DOCTOR", "PHARMACIST", "ADMIN"] as const).map((role) => (
                <button
                  id={`login-role-${role.toLowerCase()}`}
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`py-3 px-1 rounded-lg font-bold tracking-wider transition-all cursor-pointer uppercase ${
                    selectedRole === role
                      ? "bg-neon-cyan text-cyber-dark shadow-[0_0_15px_rgba(0,240,255,0.2)] font-black"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Secure details form input */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] text-slate-500 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neon-cyan" /> DECENTRALIZED SIGNER IDENTIFIER (DID)
              </label>
              <input
                id="login-did-input"
                type="text"
                value={customDid}
                onChange={(e) => setCustomDid(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-3 font-mono text-xs text-slate-300 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] text-slate-500 tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-neon-purple" /> SECURE BIOMETRIC CHALLENGE KEY
              </label>
              <div className="relative flex items-center">
                <input
                  id="login-secret-input"
                  type="password"
                  disabled
                  placeholder="[CRYPTO-SEEDS-AUTO-GENERATED]"
                  className="w-full bg-slate-950/40 border border-slate-900/40 rounded-xl px-4 py-3 font-mono text-xs text-slate-600 focus:outline-none cursor-not-allowed select-none"
                />
              </div>
            </div>
          </div>

          {/* Multi-step scanning button */}
          <button
            id="start-biometric-scan-btn"
            type="button"
            disabled={isScanning}
            onClick={startSecureScan}
            className={`w-full py-4 rounded-xl font-display font-bold tracking-widest text-sm flex items-center justify-center gap-2 transition-all cursor-pointer relative overflow-hidden ${
              isScanning
                ? "bg-slate-950 border border-neon-cyan/20 text-neon-cyan"
                : "bg-gradient-to-r from-neon-blue to-neon-cyan hover:from-neon-blue hover:to-white text-cyber-dark hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]"
            }`}
          >
            {isScanning && (
              <div className="absolute inset-x-0 h-[2px] bg-neon-cyan animate-scanline top-0" />
            )}
            <Fingerprint className={`w-5 h-5 ${isScanning ? "animate-pulse" : ""}`} />
            {isScanning ? "SCANNING BIOMETRICS..." : "INITIALIZE SECURE LOGON"}
          </button>

          {/* Secure terminal log streams inside login card */}
          <div className="mt-8 pt-6 border-t border-slate-900 font-mono text-[9px] text-slate-500 flex flex-col gap-2">
            <div className="flex items-center gap-1 text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              <span>TERMINAL_LOG_SYNC</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900/60 leading-normal max-h-[96px] overflow-y-auto space-y-1 text-neon-cyan/70 select-none">
              {terminalLogs.map((log, index) => (
                <div key={index} className="flex gap-1">
                  <span className="text-slate-600">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Safety Info/Disclaimer Footer */}
      <div className="mt-8 text-center max-w-sm text-[9px] font-mono text-slate-600 leading-normal z-10 flex flex-col gap-1">
        <div className="flex items-center gap-1 justify-center text-slate-500">
          <AlertTriangle className="w-3 h-3 text-neon-cyan" />
          <span>Patient Identity Sovereignty Agreement v4.2</span>
        </div>
        <p>Private keys are preserved exclusively in RAM memory. No telemetry indices leave your decentralized client node wrapper sans explicit user consent.</p>
      </div>
    </div>
  );
}
