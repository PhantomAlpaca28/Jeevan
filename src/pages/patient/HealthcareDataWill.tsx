/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  AlertOctagon,
  Users,
  Award,
  Trash2,
  Lock,
  CalendarCheck,
  Check,
  Globe,
  Settings,
  UserCheck2,
  FileBadge,
  Save,
  HelpCircle
} from "lucide-react";
import GlassCard from "../../components/GlassCard";

interface DataWillSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
  metaLabel?: string;
  metaValue?: string;
  type: "SHARE_FAMILY" | "SHARE_RESEARCH" | "DELETE";
}

export default function HealthcareDataWill() {
  const [trusteeName, setTrusteeName] = useState("Alexander Vance");
  const [trusteeDid, setTrusteeDid] = useState("did:vitaltwin:ipns:3c0d8f7ea3321bcc8dca101");
  const [selectedResearchType, setSelectedResearchType] = useState<string>("Longevity & Genetics");
  const [destructionProtocol, setDestructionProtocol] = useState<string>("SHA-512 Zeroing Sweep");
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [options, setOptions] = useState<DataWillSetting[]>([
    {
      id: "opt_family",
      title: "Designate Sovereign Legacy Trustee (Family Share)",
      description: "Transfer cryptographic decryption keys to an authorized trustee node upon 180 continuous cycles of inactive diagnostic heartbeat telemetry.",
      icon: Users,
      enabled: true,
      type: "SHARE_FAMILY"
    },
    {
      id: "opt_research",
      title: "Contribute to Decentralized Scientific Research Commons",
      description: "Fully anonymize structural metadata of genome clusters and append to public research chains to accelerate neural therapeutics.",
      icon: Globe,
      enabled: false,
      type: "SHARE_RESEARCH"
    },
    {
      id: "opt_delete",
      title: "Hard Cryptographic Permanent Disintegration (Destroy)",
      description: "Perform fully authoritative mathematical zeroing of on-chain hash matrices, forever locking access to historic diagnostic records.",
      icon: Trash2,
      enabled: false,
      type: "DELETE"
    }
  ]);

  const handleToggle = (id: string) => {
    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === id) {
          const nextState = !opt.enabled;
          // If enabling DELETE permanently, restrict / warn about conflicting share modes
          if (id === "opt_delete" && nextState) {
            // Warn or offset other settings
            return { ...opt, enabled: nextState };
          }
          return { ...opt, enabled: nextState };
        }
        return opt;
      })
    );
  };

  const handleSaveChanges = async () => {
    setSaveLoading(true);
    setIsSaved(false);

    // Simulate cryptographic smart-will compilation
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setSaveLoading(false);
    setIsSaved(true);

    // Dynamic banner auto fade
    setTimeout(() => {
      setIsSaved(false);
    }, 4000);
  };

  const familyOption = options.find((o) => o.type === "SHARE_FAMILY");
  const researchOption = options.find((o) => o.type === "SHARE_RESEARCH");
  const deleteOption = options.find((o) => o.type === "DELETE");

  return (
    <div id="healthcare-data-will" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Toggle options lists and settings details */}
        <div className="lg:col-span-7 space-y-5">
          <GlassCard glowColor="none" hoverable={false} className="p-5 bg-slate-950/40">
            <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display font-medium text-sm text-white">Sovereign Legacy Protocol</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Define programmatic directives enforced automatically by decentralized smart-will nodes.</p>
              </div>
              <FileBadge className="w-5 h-5 text-neon-blue animate-pulse" />
            </div>

            <div className="space-y-4 mt-5">
              {options.map((opt) => {
                const Icon = opt.icon;
                return (
                  <div
                    id={`will-option-${opt.id}`}
                    key={opt.id}
                    className={`p-4 rounded-xl border transition-all ${
                      opt.enabled
                        ? "bg-slate-950 border-neon-blue/45 shadow-[0_0_15px_rgba(0,102,255,0.05)]"
                        : "bg-slate-950/20 border-slate-900/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-lg border shrink-0 ${
                          opt.enabled
                            ? "bg-neon-blue/10 border-neon-blue/30 text-neon-cyan"
                            : "bg-slate-950 border-slate-900 text-slate-500"
                        }`}>
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div className="leading-tight">
                          <h4 className={`text-xs font-bold ${opt.enabled ? "text-white" : "text-slate-400"}`}>
                            {opt.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 leading-normal mt-1.5 font-mono">
                            {opt.description}
                          </p>
                        </div>
                      </div>

                      {/* Dynamic Switch Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggle(opt.id)}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 cursor-pointer ${
                          opt.enabled ? "bg-neon-cyan" : "bg-slate-900"
                        }`}
                      >
                        <div
                          className={`bg-slate-950 w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                            opt.enabled ? "translate-x-4.5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Expand inputs if enabled */}
                    {opt.enabled && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 pt-3.5 border-t border-slate-900/60 space-y-3 font-mono text-[11px]"
                      >
                        {opt.type === "SHARE_FAMILY" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">TRUSTEE_LEGAL_NAME</label>
                              <input
                                type="text"
                                value={trusteeName}
                                onChange={(e) => setTrusteeName(e.target.value)}
                                className="bg-slate-950 border border-slate-900 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-neon-blue font-mono"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">SOVEREIGN_NODE_DID</label>
                              <input
                                type="text"
                                value={trusteeDid}
                                onChange={(e) => setTrusteeDid(e.target.value)}
                                className="bg-slate-950 border border-slate-900 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 focus:outline-none focus:border-neon-blue font-mono truncate select-all"
                              />
                            </div>
                          </div>
                        )}

                        {opt.type === "SHARE_RESEARCH" && (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">AUTHORIZED_BIO_FIELD</label>
                            <div className="flex gap-2">
                              {["Longevity & Genetics", "Neuromorphic AI", "Oncologic Screening"].map((cat) => (
                                <button
                                  key={cat}
                                  onClick={() => setSelectedResearchType(cat)}
                                  className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold tracking-wide transition-all cursor-pointer ${
                                    selectedResearchType === cat
                                      ? "bg-neon-blue/15 text-neon-cyan border-neon-blue/30"
                                      : "bg-slate-950 text-slate-500 border-slate-900"
                                  }`}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {opt.type === "DELETE" && (
                          <div className="bg-red-950/10 border border-red-900/30 p-2.5 rounded-lg flex items-start gap-2 text-red-400">
                            <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
                            <div className="leading-tight">
                              <span className="block font-bold uppercase text-[8px] tracking-wide">PERMANENT_DESTRUCTION_WARNING</span>
                              <p className="text-[9px] text-slate-500 mt-1 leading-normal">
                                Enabling raw record destruction will block access keys and overwrite files. If family sharing is enabled concurrently, data deletion will bypass key transfer if destruction conditions trip first.
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Save trigger CTA */}
          <div className="flex items-center gap-3">
            <button
              id="save-will-btn"
              onClick={handleSaveChanges}
              disabled={saveLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-cyan text-cyber-dark font-display font-black text-xs tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,102,255,0.25)] transition-all cursor-pointer uppercase"
            >
              {saveLoading ? "Compiling legal block..." : "Register Smart Will Directive"}
            </button>

            <AnimatePresence>
              {isSaved && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1 text-[10px] font-mono text-neon-green"
                >
                  <Check className="w-4 h-4" /> WILL PROTOCOL SIGNED ON CONTRACT LAYER 
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right column: Certificate rendering visualization feedback mock */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard glowColor="blue" hoverable={false} className="p-6 bg-slate-950/80 border-2 border-neon-blue/30 relative overflow-hidden text-[10px]">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-blue/5 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-neon-cyan/5 rounded-full blur-[50px] pointer-events-none" />

            <div className="border-b border-dashed border-slate-800 pb-4 mb-4">
              <span className="font-mono text-[8.5px] text-neon-blue font-bold tracking-widest uppercase">SOVEREIGN_WILL_CERTIFICATE</span>
              <h3 className="font-display font-black text-sm text-slate-100 uppercase mt-1">Data Estate Directives</h3>
            </div>

            <div className="space-y-4 font-mono leading-relaxed text-slate-400">
              {/* Directive 1: Family */}
              <div>
                <span className="text-slate-500 block text-[8px] tracking-wider uppercase font-bold">Legacy Trustee Delegation</span>
                {familyOption?.enabled ? (
                  <div className="mt-1 bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex items-start gap-2">
                    <UserCheck2 className="w-4 h-4 text-neon-cyan mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-slate-200 block">{trusteeName}</strong>
                      <span className="text-[9px] text-slate-500 block truncate">{trusteeDid}</span>
                      <span className="text-[8px] bg-neon-blue/10 text-neon-cyan font-bold px-1 py-0.2 rounded mt-1.5 inline-block uppercase text-center leading-none">
                        Active Inactivity Trigger: 180 Days
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-600 italic text-[9px] mt-1 pl-1">No trustee configured. Estate default goes to network archive.</div>
                )}
              </div>

              {/* Directive 2: Research Commons */}
              <div className="pt-3.5 border-t border-slate-900/50">
                <span className="text-slate-500 block text-[8px] tracking-wider uppercase font-bold">Research Commons Contribution</span>
                {researchOption?.enabled ? (
                  <div className="mt-1 bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex items-center justify-between">
                    <div>
                      <strong className="text-neon-green uppercase block">{selectedResearchType}</strong>
                      <span className="text-[9px] text-slate-500 block">ZKP-summarized transit models</span>
                    </div>
                    <span className="text-neon-green animate-pulse">● ALLOWED</span>
                  </div>
                ) : (
                  <div className="text-slate-600 italic text-[9px] mt-1 pl-1">Closed research gateway settings verified.</div>
                )}
              </div>

              {/* Directive 3: Destruction Protocol */}
              <div className="pt-3.5 border-t border-slate-900/50">
                <span className="text-slate-500 block text-[8px] tracking-wider uppercase font-bold">Purge & Zero-Out Directive</span>
                {deleteOption?.enabled ? (
                  <div className="mt-1 bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg flex items-center justify-between text-red-400">
                    <div>
                      <strong className="block uppercase">AUTHORITATIVE DISINTEGRATION</strong>
                      <span className="text-[9px] text-slate-500 block">Overwrite method: {destructionProtocol}</span>
                    </div>
                    <span>ACTIVE</span>
                  </div>
                ) : (
                  <div className="text-slate-600 italic text-[9px] mt-1 pl-1">Perpetual encrypted server custody active.</div>
                )}
              </div>
            </div>

            {/* Smart Contract Proof details block */}
            <div className="mt-6 pt-4 border-t border-dashed border-slate-800 flex items-center justify-between font-mono text-[8px] text-slate-500 leading-none">
              <div>
                <span>CONTRACT_CIPHER_PROOF:</span>
                <span className="text-slate-400 block font-semibold mt-1">did:vitaltwin:contract:will:0x1b7ae9c</span>
              </div>
              <div className="text-right">
                <span>REVISION:</span>
                <span className="text-slate-400 block font-semibold mt-1">v1.0 (PROD)</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
