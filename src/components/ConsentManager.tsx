/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ConsentPermission } from "../types";
import { Lock, Unlock, EyeOff, ShieldCheck, HeartPulse, RefreshCcw, Landmark, UserMinus, Cpu } from "lucide-react";

interface ConsentManagerProps {
  consents: ConsentPermission[];
  onUpdateConsent: (id: string, newScope: ConsentPermission["scope"]) => Promise<void>;
}

export default function ConsentManager({ consents, onUpdateConsent }: ConsentManagerProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pendingUpdate, setPendingUpdate] = useState<{ id: string; scope: ConsentPermission["scope"] } | null>(null);

  const getScopeIcon = (scope: ConsentPermission["scope"]) => {
    switch (scope) {
      case "FULL_OMNI_ACCESS":
        return <Unlock className="w-4 h-4 text-neon-green" />;
      case "ANONYMIZED_AGGREGATE":
        return <ShieldCheck className="w-4 h-4 text-neon-cyan" />;
      case "NEURAL_ONLY":
        return <HeartPulse className="w-4 h-4 text-neon-blue" />;
      case "REVOKED":
        return <EyeOff className="w-4 h-4 text-neon-rose" />;
    }
  };

  const getScopeColorClass = (scope: ConsentPermission["scope"]) => {
    switch (scope) {
      case "FULL_OMNI_ACCESS":
        return "text-neon-green bg-neon-green/10 border-neon-green/35";
      case "ANONYMIZED_AGGREGATE":
        return "text-neon-cyan bg-neon-cyan/10 border-neon-cyan/35";
      case "NEURAL_ONLY":
        return "text-neon-blue bg-neon-blue/10 border-neon-blue/35";
      case "REVOKED":
        return "text-neon-rose bg-neon-rose/10 border-neon-rose/35";
    }
  };

  const handleScopeChange = async (id: string, scope: ConsentPermission["scope"]) => {
    setUpdatingId(id);
    setPendingUpdate({ id, scope });
    
    // Simulate smart contract node verification delay
    await onUpdateConsent(id, scope);
    
    setUpdatingId(null);
    setPendingUpdate(null);
  };

  return (
    <div id="consent-manager-panel" className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-lg font-bold text-white">Sovereign Data Sharing Consent Hub</h3>
        <p className="text-xs text-slate-400">
          Manage live access permission to your medical and neural telemetry. Changing these controls in real-time instantly re-keys decentralized records on the IPFS index, distributing dynamic VTX reward allocations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4.5">
        {consents.map((consent) => {
          const isActivelyUpdating = updatingId === consent.id;

          return (
            <div
              key={consent.id}
              className={`glass-panel p-5 rounded-2xl relative overflow-hidden transition-all duration-300 ${
                consent.scope === "REVOKED"
                  ? "border-red-950/20 bg-slate-950/50 opacity-70"
                  : "hover:border-neon-cyan/25"
              }`}
            >
              {/* Spinning sync background glow */}
              {isActivelyUpdating && (
                <div className="absolute inset-0 bg-cyber-dark/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3">
                  <RefreshCcw className="w-8 h-8 text-neon-cyan animate-spin" />
                  <div className="text-center">
                    <p className="text-xs font-mono font-bold tracking-wider text-white">BROADCASTING_CONSENT_SIG</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-1">Re-keying IPFS indexes • Propagating change logs to peer nodes...</p>
                  </div>
                </div>
              )}

              {/* Header details */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl border ${
                    consent.id === 'con-001' ? 'bg-neon-cyan/10 border-neon-cyan/20': 
                    consent.id === 'con-002' ? 'bg-neon-cyan/10 border-neon-cyan/20': 
                    consent.id === 'con-003' ? 'bg-neon-blue/10 border-neon-blue/20': 
                    'bg-slate-900 border-slate-800'
                  }`}>
                    {consent.entityType === "AI_DIAGNOSTIC_AGENT" ? <Cpu className="w-5 h-5 text-neon-cyan" /> :
                     consent.entityType === "RESEARCH_CONSOR_PHARMA" ? <Landmark className="w-5 h-5 text-neon-purple" /> :
                     consent.entityType === "PRIMARY_CARE_HOSPITAL" ? <HeartPulse className="w-5 h-5 text-neon-blue" /> :
                     <UserMinus className="w-5 h-5 text-neon-rose" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-semibold text-white text-sm">{consent.entityName}</h4>
                      {consent.isSessionTokenActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" title="Session token is active" />
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">{consent.entityType}</span>
                  </div>
                </div>

                {/* Scope pill status */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500">REWARD_STAKING:</span>
                  <span className="font-mono text-xs font-bold text-neon-cyan">
                    {consent.vtxStakingReward > 0 ? `+${consent.vtxStakingReward.toFixed(2)} VTX/m` : "0.00 VTX/m"}
                  </span>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-medium rounded-lg border ${getScopeColorClass(consent.scope)}`}>
                    {getScopeIcon(consent.scope)}
                    <span>{consent.scope.replace("_", " ")}</span>
                  </div>
                </div>
              </div>

              {/* Slider / Range picker of scopes */}
              <div className="border-t border-slate-900 pt-4 mt-3 flex flex-col gap-2.5">
                <span className="font-mono text-[9px] text-slate-500 tracking-wider">CHANGE ACCESS SCOPE</span>
                <div className="grid grid-cols-4 bg-slate-950 p-1 rounded-xl border border-slate-900 gap-1 text-center font-mono text-[9px]">
                  {(["REVOKED", "NEURAL_ONLY", "ANONYMIZED_AGGREGATE", "FULL_OMNI_ACCESS"] as const).map((scp) => (
                    <button
                      id={`scope-${consent.id}-${scp.toLowerCase()}`}
                      key={scp}
                      onClick={() => handleScopeChange(consent.id, scp)}
                      className={`py-2 px-1 rounded-lg font-semibold transition-all uppercase cursor-pointer ${
                        consent.scope === scp
                          ? scp === "REVOKED" ? "bg-neon-rose/20 text-neon-rose border border-neon-rose/30 font-bold" :
                            scp === "NEURAL_ONLY" ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30 font-bold" :
                            scp === "ANONYMIZED_AGGREGATE" ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 font-bold" :
                            "bg-neon-green/20 text-neon-green border border-neon-green/30 font-bold"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {scp === "REVOKED" ? "REVOKE" :
                       scp === "NEURAL_ONLY" ? "NEURAL" :
                       scp === "ANONYMIZED_AGGREGATE" ? "ANON DIGEST" : "OMNI"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
