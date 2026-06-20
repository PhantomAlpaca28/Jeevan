/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Clock,
  User,
  CheckCircle2,
  Lock,
  ArrowRight,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Key,
  Flame,
  CheckSquare
} from "lucide-react";
import GlassCard from "../../components/GlassCard";

export interface AuditEvent {
  id: string;
  eventType: "REQUEST" | "APPROVE" | "ACCESS" | "REVOKE" | "OVERRIDE";
  title: string;
  actor: string;
  actorDid: string;
  description: string;
  timestamp: string;
  blockHeight: number;
  txHash: string;
  status: "SIGNED" | "VERIFIED" | "ALERT";
}

const INITIAL_EVENTS: AuditEvent[] = [
  {
    id: "tx_1001",
    eventType: "OVERRIDE",
    title: "Emergency Break-Glass Override Engaged",
    actor: "Dr. Michael Stone",
    actorDid: "did:vortexa:operator:doc_9031ef09cda81",
    description: "Emergency override payload released due to neuro-resilient trance coma state.",
    timestamp: "10 mins ago",
    blockHeight: 620491,
    txHash: "0xfa8e10b299e4f1a23c2d4e5f6a7b8c9d01e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6",
    status: "ALERT"
  },
  {
    id: "tx_1002",
    eventType: "ACCESS",
    title: "Biometric Vitals Stream Accessed",
    actor: "Aetheric Synapsis Core Host",
    actorDid: "did:vortexa:operator:hsp_4419ad21bfa99",
    description: "Continuous telemetry stream decrypted under active clinical consent grant.",
    timestamp: "2 hours ago",
    blockHeight: 620475,
    txHash: "0x3e18a80277bd21abcc818ef77ae2219bcbf0d1e2f3a4b5c6d7e8f9a0b1c2d3e4",
    status: "VERIFIED"
  },
  {
    id: "tx_1003",
    eventType: "APPROVE",
    title: "Consent Policy Approved",
    actor: "Self Node (Alexander Vance)",
    actorDid: "did:vortexa:ipns:8f2a9e31dcdc6bf71b4eef2",
    description: "Authorized HLA gene cluster query to Longevity Genome Commons under Zero-Knowledge constraints.",
    timestamp: "5 hours ago",
    blockHeight: 620431,
    txHash: "0x889a77cebc33a121bf90ad8e101ca701c3de5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
    status: "SIGNED"
  },
  {
    id: "tx_1004",
    eventType: "REQUEST",
    title: "Access Handshake Request Created",
    actor: "Global Longevity Genome Initiative",
    actorDid: "did:vortexa:operator:lab_10022faee9dd1",
    description: "Requested read authorization for HLA synaptic resilience HLA markers cluster.",
    timestamp: "6 hours ago",
    blockHeight: 620420,
    txHash: "0x12bb7764de839bcc3fc8e03ea22cc81bdf9ef0d1e2f3a4b9c1d2e3f4a5b6c7d8",
    status: "VERIFIED"
  },
  {
    id: "tx_1005",
    eventType: "REVOKE",
    title: "Handshake Transmission Pipeline Revoked",
    actor: "Self Node (Alexander Vance)",
    actorDid: "did:vortexa:ipns:8f2a9e31dcdc6bf71b4eef2",
    description: "Terminated third-party secondary data sharing gateway for Pharma-Labs Core.",
    timestamp: "Yesterday",
    blockHeight: 619985,
    txHash: "0xb3ee7a22efc31fbb9c21e780ad22bc018efd9e7c8d9e0f1a2b3c4d5e6f7a8b9c",
    status: "SIGNED"
  },
  {
    id: "tx_1006",
    eventType: "APPROVE",
    title: "Emergency Backup Guardian Configured",
    actor: "Self Node (Alexander Vance)",
    actorDid: "did:vortexa:ipns:8f2a9e31dcdc6bf71b4eef2",
    description: "Assigned Alexander Vance as Legacy Trustee with 180-cycle inactivity dynamic trigger envelope.",
    timestamp: "3 days ago",
    blockHeight: 618450,
    txHash: "0x9922a101bcf33decba39ea22bc8edca101f3de5a6b7c8d9e0f1a2b3c4d5e6f7a8",
    status: "VERIFIED"
  }
];

export default function AuditTimeline() {
  const [events, setEvents] = useState<AuditEvent[]>(INITIAL_EVENTS);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<string | null>(null);

  const handleVerifyLedger = async () => {
    setIsValidating(true);
    setValidationResult(null);
    
    // Simulate cryptographic verification scan
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsValidating(false);
    setValidationResult("LEDGER_INTEGRITY_VALID: All Merkle Root branches successfully synchronized and signed with sovereign key sequences.");
  };

  const filteredEvents = events.filter((e) => {
    const matchesFilter = filterType === "ALL" || e.eventType === filterType;
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.txHash.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getEventBadge = (type: AuditEvent["eventType"]) => {
    switch (type) {
      case "REQUEST":
        return {
          icon: Clock,
          color: "text-neon-cyan bg-neon-cyan/5 border-neon-cyan/20",
          label: "Request Created"
        };
      case "APPROVE":
        return {
          icon: CheckSquare,
          color: "text-neon-green bg-neon-green/5 border-neon-green/20",
          label: "Consent Approved"
        };
      case "ACCESS":
        return {
          icon: Eye,
          color: "text-neon-blue bg-neon-blue/5 border-neon-blue/20",
          label: "Record Accessed"
        };
      case "REVOKE":
        return {
          icon: Lock,
          color: "text-neon-purple bg-neon-purple/5 border-neon-purple/20",
          label: "Access Revoked"
        };
      case "OVERRIDE":
        return {
          icon: Flame,
          color: "text-red-400 bg-red-950/20 border-red-900/30 animate-pulse",
          label: "Override Warning"
        };
    }
  };

  return (
    <div id="cryptographic-audit-timeline" className="space-y-6">
      {/* Search and Filters Glass Header */}
      <GlassCard glowColor="none" hoverable={false} className="p-4 bg-slate-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="timeline-search-field"
                type="text"
                placeholder="Search audit ledger by actor or hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-lg pl-9.5 pr-4 py-2 font-mono text-xs text-slate-300 focus:outline-none focus:border-neon-cyan"
              />
            </div>

            <div className="flex gap-1">
              {["ALL", "REQUEST", "APPROVE", "ACCESS", "REVOKE", "OVERRIDE"].map((type) => (
                <button
                  key={type}
                  id={`filter-btn-${type}`}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold tracking-wider transition-all cursor-pointer font-mono ${
                    filterType === type
                      ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40"
                      : "bg-slate-950 text-slate-500 border-slate-900 hover:text-slate-300 hover:border-slate-800"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            id="audit-verify-ledger-btn"
            onClick={handleVerifyLedger}
            disabled={isValidating}
            className="px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-neon-cyan font-mono text-[10px] uppercase font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? "animate-spin text-neon-cyan" : ""}`} />
            {isValidating ? "Scanning Ledger Chain..." : "Verify Cryptography Integrity"}
          </button>
        </div>

        {/* Validation result popup */}
        <AnimatePresence>
          {validationResult && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3.5 p-3.5 bg-neon-green/5 border border-neon-green/30 text-neon-green font-mono text-[10px] rounded-lg flex items-center gap-2.5 leading-normal"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{validationResult}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Timeline view list */}
      <GlassCard glowColor="none" hoverable={false} className="p-6 bg-slate-950/40">
        <div className="border-b border-slate-900 pb-3 mb-6">
          <h3 className="font-display font-medium text-sm text-white">Cryptographic Sovereign Audit Log</h3>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Merkle-linked append-only ledger history validating health records usage cycles.</p>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 font-mono text-xs text-slate-500">
            No audit ledger entries match selection indexes.
          </div>
        ) : (
          <div className="relative pl-6 md:pl-8 border-l border-slate-900 space-y-7 ml-3.5">
            {filteredEvents.map((event, idx) => {
              const badge = getEventBadge(event.eventType);
              const BadgeIcon = badge.icon;
              
              return (
                <motion.div
                  id={`audit-event-${event.id}`}
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative group select-text"
                >
                  {/* Timeline bullet nodes */}
                  <div className={`absolute -left-10 md:-left-12 top-0.5 w-8 h-8 rounded-full border flex items-center justify-center ${badge.color} z-10 shadow-sm`}>
                    <BadgeIcon className="w-4 h-4" />
                  </div>

                  {/* Left edge indicator lines */}
                  <div className="bg-slate-950/80 p-4.5 rounded-xl border border-slate-900/60 hover:border-slate-800 transition-all space-y-3">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2.5">
                      {/* Left header */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span className="font-mono text-[9px] text-slate-500 block">
                            Block #{event.blockHeight}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-xs text-slate-200 mt-1">{event.title}</h4>
                      </div>

                      {/* Right timeline details */}
                      <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500 md:text-right">
                        <Clock className="w-3 h-3" />
                        <span>{event.timestamp}</span>
                      </div>
                    </div>

                    <p className="font-mono text-[10.5px] text-slate-400 leading-normal">
                      {event.description}
                    </p>

                    {/* Metadata blockchain indices container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 border-t border-slate-900/50 pt-3.5 font-mono text-[9.5px]">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <div>
                          <span className="text-slate-500 block text-[7.5px] uppercase font-bold leading-none">ACTOR_IDENTITY</span>
                          <span className="text-slate-300 font-semibold">{event.actor}</span>
                          <span className="text-[8px] text-slate-500 block truncate leading-none mt-0.5">{event.actorDid}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Key className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <div className="truncate w-full min-w-0">
                          <span className="text-slate-500 block text-[7.5px] uppercase font-bold leading-none">TRANSACTION_SHA256_HASH</span>
                          <span className="text-slate-400 select-all truncate font-semibold block">{event.txHash}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
