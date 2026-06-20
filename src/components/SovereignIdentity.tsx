/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { SovereignCredential, BlockTransaction } from "../types";
import { Key, RotateCw, Wallet, Cpu, Copy, Check, Terminal, ExternalLink } from "lucide-react";

interface SovereignIdentityProps {
  credentials: SovereignCredential;
  transactions: BlockTransaction[];
  onRotateKeys: () => Promise<void>;
  onClaimTokens: () => Promise<void>;
}

export default function SovereignIdentity({
  credentials,
  transactions,
  onRotateKeys,
  onClaimTokens
}: SovereignIdentityProps) {
  const [rotating, setRotating] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [copiedDoc, setCopiedDoc] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "SYS_BOOT: Sovereign Identity Decentralized Network protocol active.",
    "IDENTITY: did:vitaltwin:ipns:8f2a9e31dcdc6bf71b4eef2 loaded.",
    "STATUS: Verification signature valid. Cryptographic seeds synced."
  ]);

  const addLog = (log: string) => {
    setTerminalLogs((prev) => [...prev.slice(-4), log]);
  };

  const handleRotate = async () => {
    setRotating(true);
    addLog(`ROTATE_SEED: Initiating SECP256K1 / ED25519 asymmetric pair rebuild...`);
    
    // Simulate active cryptographic state progress
    await new Promise((r) => setTimeout(r, 600));
    addLog(`COMPILING: Compressive multi-sign key agreement updated.`);
    
    await onRotateKeys();
    setRotating(false);
    addLog(`COMPLETED: On-chain ledger rotated securely. Session refreshed.`);
  };

  const handleClaim = async () => {
    setClaiming(true);
    addLog(`CLAIM_VTX: Staking allocation rewards detected. Compiling zero-knowledge claim proof...`);
    
    await new Promise((r) => setTimeout(r, 500));
    addLog(`SENDING: Submitting cryptographic claim digest to Vital Twin Core Node...`);
    
    await onClaimTokens();
    setClaiming(false);
    addLog(`GRANTED: Claim success. +50.0 VTX credits assigned dynamically.`);
  };

  const copyDID = () => {
    navigator.clipboard.writeText(credentials.did);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  return (
    <div id="sovereign-identity-card" className="w-full flex flex-col gap-5">
      {/* Sovereign Key Identification Hologram Card */}
      <div className="glass-panel-heavy rounded-2xl p-5 border border-neon-cyan/20 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-neon-purple/5 rounded-full blur-[30px] pointer-events-none" />
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-neon-cyan/10 p-2 rounded-lg border border-neon-cyan/20">
              <Wallet className="w-5 h-5 text-neon-cyan" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-md">SOVEREIGN NETWORK PASS</h4>
              <span className="text-[9px] font-mono text-slate-400">STATE_LEVEL: HIGH_COHERENCE</span>
            </div>
          </div>
          <div className="flex bg-slate-950/80 px-2 py-1 rounded-md border border-neon-purple/20 items-center gap-1.5 font-mono text-[9px] text-neon-purple font-semibold animate-pulse-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" /> {credentials.authStatus}
          </div>
        </div>

        {/* DID block identifier */}
        <div className="flex flex-col gap-1 text-xs mb-4">
          <span className="font-mono text-[9px] text-slate-500 tracking-wider">PATIENT DECENTRALIZED IDENTITY (DID)</span>
          <div className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-slate-900 font-mono text-[10px] text-slate-300">
            <div className="truncate pr-2">{credentials.did}</div>
            <button
              id="copy-did-btn"
              onClick={copyDID}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-neon-cyan transition-all"
            >
              {copiedDoc ? <Check className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Public cryptographic fingerprint */}
        <div className="flex flex-col gap-1 text-xs mb-5">
          <span className="font-mono text-[9px] text-slate-500 tracking-wider">SECURE ASYMMETRIC PUBLIC KEY (SHA-512)</span>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 font-mono text-[9px] text-slate-400 leading-relaxed break-all">
            {credentials.publicKey}
          </div>
        </div>

        {/* Dynamic VTX Currency Staking Hud and Core Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col justify-end">
            <span className="font-mono text-[9px] text-slate-500 tracking-wider">CREDIT_BALANCE</span>
            <div className="text-2xl font-bold font-mono text-white mt-0.5 flex items-baseline gap-1.5">
              {credentials.vtxCredits.toFixed(2)}
              <span className="text-xs text-neon-cyan font-bold tracking-widest text-opacity-80">VTX</span>
            </div>
            <span className="text-[8px] font-mono text-slate-400 mt-1">Staking APY: 14.2%</span>
          </div>

          <div className="flex flex-col gap-2 justify-end">
            <button
              id="rotate-keys-btn"
              disabled={rotating}
              onClick={handleRotate}
              className={`flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl text-xs font-mono font-medium transition-all ${
                rotating
                  ? "bg-slate-900 text-slate-500 border border-slate-800"
                  : "bg-gradient-to-r from-neon-purple/20 to-neon-cyan/10 hover:from-neon-purple/30 hover:to-neon-cyan/20 text-white border border-neon-cyan/20 hover:border-neon-cyan/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] cursor-pointer"
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 text-neon-cyan ${rotating ? "animate-spin" : ""}`} />
              {rotating ? "VERIFYING..." : "ROTATE KEYS"}
            </button>

            <button
              id="claim-tokens-btn"
              disabled={claiming}
              onClick={handleClaim}
              className={`flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl text-xs font-display font-semibold tracking-wider transition-all cursor-pointer ${
                claiming
                  ? "bg-slate-900 text-slate-500 border border-slate-800"
                  : "bg-neon-cyan text-cyber-dark hover:bg-white hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] font-black"
              }`}
            >
              <Cpu className={`w-3.5 h-3.5 ${claiming ? "animate-bounce" : ""}`} />
              {claiming ? "MINING..." : "CLAIM VTX"}
            </button>
          </div>
        </div>
      </div>

      {/* Cybernetic Identity Terminal Console Log */}
      <div className="glass-panel p-4 rounded-xl flex flex-col gap-2 border border-neon-cyan/10">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-neon-cyan" />
          <span className="text-[10px] font-mono tracking-wider font-semibold uppercase">IDENTITY_EVENT_STREAM</span>
        </div>
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-900/60 font-mono text-[9px] text-neon-cyan/85 space-y-1.5 h-28 overflow-y-auto">
          {terminalLogs.map((log, index) => (
            <div key={index} className="flex gap-1">
              <span className="text-slate-600 select-none">&gt;</span>
              <p className="leading-normal break-all">{log}</p>
            </div>
          ))}
        </div>
      </div>

      {/* IPFS Blockchain Ledger Sync Registry */}
      <div className="glass-panel p-4 rounded-xl flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider">BLOCKCHAIN_LEDGER_REGISTRY</span>
          <span className="text-[8px] font-mono text-neon-purple flex items-center gap-1 animate-pulse">
            ● SYNCED_NODE_641
          </span>
        </div>
        
        <div className="space-y-2.5">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-lg border border-slate-900/40 hover:border-slate-800/80 hover:bg-slate-950/70 transition-all font-mono text-[10px]">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold ${
                    tx.actionType === "KEY_ROTATION" ? "bg-neon-purple/15 text-neon-purple border border-neon-purple/25" :
                    tx.actionType === "CONSENT_GRANT" ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/25" :
                    tx.actionType === "CONSENT_REVOKE" ? "bg-neon-rose/15 text-neon-rose border border-neon-rose/25" :
                    tx.actionType === "DATA_ENCRYPT" ? "bg-neon-blue/15 text-neon-blue border border-neon-blue/25" :
                    "bg-neon-green/15 text-neon-green border border-neon-green/25"
                  }`}>
                    {tx.actionType}
                  </span>
                  <span className="text-white font-medium">Block #{tx.blockHeight}</span>
                </div>
                <div className="text-[8px] text-slate-500 mt-1 flex items-center gap-1.5">
                  <span>{tx.timestamp}</span>
                  <span>•</span>
                  <span className="text-slate-400 select-all">{tx.txHash}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-300 font-bold">-{tx.gasTokens} VTX</span>
                <div className="text-[8px] text-slate-500 mt-0.5 flex items-center gap-0.5 justify-end hover:text-neon-cyan cursor-pointer">
                  <span>EXPLORE</span>
                  <ExternalLink className="w-2 h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
