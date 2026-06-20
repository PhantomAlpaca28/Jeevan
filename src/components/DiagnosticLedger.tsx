/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { MedicalDiagnosticRecord } from "../types";
import { Lock, Unlock, Search, ShieldAlert, Cpu, Eye, EyeOff, Hash, CheckCircle, RefreshCw } from "lucide-react";

interface DiagnosticLedgerProps {
  records: MedicalDiagnosticRecord[];
  onEncrypt: (id: string) => Promise<boolean>;
  onDecrypt: (id: string) => Promise<boolean>;
}

export default function DiagnosticLedger({ records, onEncrypt, onDecrypt }: DiagnosticLedgerProps) {
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [transitioningId, setTransitioningId] = useState<string | null>(null);
  const [showSignModal, setShowSignModal] = useState<string | null>(null);
  const [signingProgress, setSigningProgress] = useState(false);

  // Categories available
  const categories = ["ALL", "GENOMIC", "CARDIOVASCULAR", "NEURO-SYNAPTIC", "METABOLIC"];

  // Handle encrypted state simulation scrambling
  const scrambleText = (text: string) => {
    return text.split("")
      .map((char) => (Math.random() > 0.4 ? String.fromCharCode(Math.floor(Math.random() * 40) + 33) : char))
      .join("")
      .substring(0, 160) + "... [CRYPTOGRAPHIC_LOCK_ACTIVE]";
  };

  const handleEncrypt = async (id: string) => {
    setTransitioningId(id);
    await onEncrypt(id);
    setTransitioningId(null);
  };

  const triggerDecryptFlow = (id: string) => {
    setShowSignModal(id);
  };

  const handleDecryptSign = async () => {
    if (!showSignModal) return;
    const targetId = showSignModal;
    setSigningProgress(true);
    
    // Simulate signature biometric challenge delay
    await new Promise((r) => setTimeout(r, 1200));
    await onDecrypt(targetId);
    
    setSigningProgress(false);
    setShowSignModal(null);
  };

  const filteredRecords = records.filter((r) => {
    const matchesCategory = filterCategory === "ALL" || r.category === filterCategory;
    const matchesSearch =
      r.diagnosticSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.clinicalNarrative.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.originNode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="diagnostic-ledger-panel" className="w-full flex flex-col gap-4">
      {/* Title & Stats */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-white">Sovereign Diagnostic Ledger</h3>
          <p className="text-xs text-slate-400">
            Encrypted diagnostic records synced from regional medical quantum nodes. You maintain independent decentralized authority over decryption keys.
          </p>
        </div>
        <div className="flex bg-slate-950 p-[3px] rounded-lg border border-slate-900 gap-1.5 font-mono text-[10px] text-slate-400 h-fit">
          <span className="px-2 py-0.5 rounded bg-slate-900 text-white border border-slate-800">
            {records.length} RECORDS
          </span>
          <span className="px-2 py-0.5 rounded text-neon-blue font-bold">
            {records.filter(r => r.isEncrypted).length} ENCRYPTED
          </span>
        </div>
      </div>

      {/* Filter and Search Bar controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-slate-950/60 p-3 rounded-xl border border-slate-900">
        <div className="relative md:col-span-4 flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3" />
          <input
            id="ledger-search-input"
            type="text"
            placeholder="Search cryptographic hashes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-neon-cyan transition-all"
          />
        </div>
        
        <div className="md:col-span-8 flex flex-wrap gap-1 font-mono text-[9px] items-center justify-end">
          {categories.map((cat) => (
            <button
              id={`cat-filter-${cat.toLowerCase()}`}
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md border font-semibold transition-all cursor-pointer ${
                filterCategory === cat
                  ? "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/25"
                  : "border-slate-900 bg-slate-950 text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Record list */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="glass-panel p-10 text-center rounded-2xl flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
            <ShieldAlert className="w-10 h-10 text-neon-rose mb-3 animate-pulse" />
            <p className="font-semibold text-white">No Ledger Syncs Detected</p>
            <p className="text-[10px] text-slate-500 mt-1 max-w-xs">Verify your Decentralized Identifier matches the active blockchain indexing clusters.</p>
          </div>
        ) : (
          filteredRecords.map((record) => {
            const isTransitioning = transitioningId === record.id;

            return (
              <div
                key={record.id}
                className={`glass-panel p-5 rounded-2xl relative overflow-hidden transition-all duration-300 ${
                  record.isEncrypted
                    ? "border-neon-purple/20 shadow-[inset_0_0_12px_rgba(189,0,255,0.02)]"
                    : "border-neon-cyan/20 hover:border-neon-cyan/35"
                }`}
              >
                {/* Visual loading overlays */}
                {isTransitioning && (
                  <div className="absolute inset-0 bg-cyber-dark/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-8 h-8 text-neon-purple animate-spin" />
                    <div className="text-center font-mono">
                      <p className="text-xs font-bold tracking-wider text-white">CRYPTOGRAPHIC_PERMUTATION</p>
                      <p className="text-[10px] text-slate-400 mt-1">Applying cipher transforms, re-syncing network ledgers...</p>
                    </div>
                  </div>
                )}

                {/* Record Header Metadata */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono border ${
                        record.severity === "CRITICAL" ? "bg-red-500/10 text-neon-rose border-red-500/20" :
                        record.severity === "ELEVATED" ? "bg-orange-500/10 text-amber-500 border-orange-500/20" :
                        "bg-green-500/10 text-neon-green border-green-500/20"
                      }`}>
                        {record.severity}
                      </span>
                      <span className="font-mono text-[9px] text-slate-500">ORIGIN:</span>
                      <span className="font-mono text-[9px] text-slate-300 font-semibold">{record.originNode}</span>
                    </div>
                    <h4 className="font-display font-bold text-white text-md mt-1.5">
                      {record.isEncrypted ? "[ENCRYPTED DATA BLOCK]" : record.diagnosticSummary}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {record.isEncrypted ? (
                      <button
                        id={`decrypt-btn-${record.id}`}
                        onClick={() => triggerDecryptFlow(record.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neon-purple/20 hover:bg-neon-purple/35 text-neon-purple border border-neon-purple/30 rounded-xl font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(189,0,255,0.15)]"
                      >
                        <Eye className="w-3.5 h-3.5 animate-pulse" />
                        DECRYPT INDEX
                      </button>
                    ) : (
                      <button
                        id={`encrypt-btn-${record.id}`}
                        onClick={() => handleEncrypt(record.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neon-cyan/15 hover:bg-neon-cyan/25 text-neon-cyan border border-neon-cyan/30 rounded-xl font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        ENCRYPT BLOCK
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-body Narrative */}
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-900/60 mb-3.5">
                  <p className={`font-mono text-xs leading-relaxed ${record.isEncrypted ? "text-slate-600 line-clamp-3 select-all leading-tight break-all font-light" : "text-slate-300"}`}>
                    {record.isEncrypted ? scrambleText(record.clinicalNarrative) : record.clinicalNarrative}
                  </p>
                </div>

                {/* Footer Hash Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-900/60 pt-3 text-[9px] font-mono text-slate-500">
                  <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3 text-neon-cyan" />
                    <span>MUTABLE_CID:</span>
                    <span className="text-slate-400 select-all font-semibold">{record.integrityHash}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>INDEXED: {record.timestamp}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className={`w-3.5 h-3.5 ${record.isEncrypted ? "text-neon-purple" : "text-neon-cyan"}`} />
                      {record.isEncrypted ? "SECURED" : "OMNI_ACCED"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cryptographic Signature Bio Signature Verification Modal Overlay */}
      {showSignModal && (
        <div id="decrypt-signature-modal" className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel-heavy p-6 max-w-sm w-full rounded-2xl border border-neon-purple/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute inset-0 cyber-dot-grid opacity-25 pointer-events-none" />

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-neon-purple/10 border border-neon-purple/30 rounded-full flex items-center justify-center text-neon-purple mb-4 animate-float">
                <Hash className="w-7 h-7" />
              </div>
              <h3 className="font-display font-medium text-white text-md">Authorize Ledger Decryption</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Provide your sovereign cryptographic key signature to decrypt this medical container record. Decrypted state resides fully in browser memory.
              </p>

              {/* Holographic Fingerprint/Scanner line indicator */}
              <div className="w-full bg-slate-950 border border-slate-900 rounded-xl h-20 relative overflow-hidden mt-4 shrink-0 flex items-center justify-center">
                <div className={`absolute inset-x-0 h-[2px] bg-neon-purple animate-scanline z-10`} />
                <div className="font-mono text-[9px] text-neon-purple animate-pulse leading-none font-bold">SOVEREIGN_KEY_VERIFY</div>
              </div>

              {/* Dialog buttons */}
              <div className="flex w-full gap-2.5 mt-5">
                <button
                  id="cancel-decrypt-btn"
                  disabled={signingProgress}
                  onClick={() => setShowSignModal(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[10px] hover:text-white transition-all cursor-pointer font-bold"
                >
                  ABORT
                </button>
                <button
                  id="confirm-decrypt-btn"
                  disabled={signingProgress}
                  onClick={handleDecryptSign}
                  className="flex-1 py-2 rounded-xl bg-neon-purple text-white hover:shadow-[0_0_20px_rgba(189,0,255,0.3)] font-mono text-[10px] flex items-center justify-center gap-1.5 transition-all font-bold cursor-pointer"
                >
                  {signingProgress ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      SIGNING...
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      SIGN & DECRYPT
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
