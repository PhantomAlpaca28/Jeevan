/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  CheckCircle2,
  Lock,
  FileCheck2,
  ShieldCheck,
  RefreshCw,
  Eye,
  AlertCircle,
  Truck,
  Heart,
  User,
  Activity,
  Award,
  ChevronRight
} from "lucide-react";
import GlassCard from "../../components/GlassCard";

interface MockPrescription {
  id: string;
  patientName: string;
  patientDid: string;
  medicationName: string;
  dosage: string;
  refillsLeft: number;
  prescribingDoctor: string;
  doctorDid: string;
  consentGrantToken: string;
  status: "PENDING" | "DISPENSED";
  dateSigned: string;
}

const INITIAL_PRESCRIPTIONS: MockPrescription[] = [
  {
    id: "PX-9011",
    patientName: "Alexander Vance",
    patientDid: "did:vitaltwin:ipns:3c0d8f7ea3321bcc8dca101",
    medicationName: "Gamma-Synaptic Calibrant Complex",
    dosage: "50mg - 1 capsule during peak circadian wave",
    refillsLeft: 3,
    prescribingDoctor: "Dr. Michael Stone",
    doctorDid: "did:vitaltwin:operator:doc_9031ef09cda81",
    consentGrantToken: "consent:token:auth:93be2a7de30",
    status: "PENDING",
    dateSigned: "June 18, 2026"
  },
  {
    id: "PX-8824",
    patientName: "Elena Rostova",
    patientDid: "did:vitaltwin:ipns:a4110ee8fbd331a90c1122bef4",
    medicationName: "Autonomic Autoregulation Serum Delta",
    dosage: "10ml - nebulized before sleep sequence",
    refillsLeft: 1,
    prescribingDoctor: "Dr. Clara Wu",
    doctorDid: "did:vitaltwin:operator:doc_811dfbc33c8ef",
    consentGrantToken: "consent:token:auth:7ebd09bcde1",
    status: "PENDING",
    dateSigned: "June 19, 2026"
  },
  {
    id: "PX-7411",
    patientName: "Marcus Thorne",
    patientDid: "did:vitaltwin:ipns:5faabcdc9031ef113bdcaed21a",
    medicationName: "Neuro-Peptide Resiliency Blockers",
    dosage: "200mcg oral sublingual - daily",
    refillsLeft: 0,
    prescribingDoctor: "Dr. Michael Stone",
    doctorDid: "did:vitaltwin:operator:doc_9031ef09cda81",
    consentGrantToken: "consent:token:auth:11cbeeaed89",
    status: "DISPENSED",
    dateSigned: "June 10, 2026"
  }
];

export default function PharmacistDashboard() {
  const [prescriptions, setPrescriptions] = useState<MockPrescription[]>(INITIAL_PRESCRIPTIONS);
  const [selectedPx, setSelectedPx] = useState<MockPrescription | null>(INITIAL_PRESCRIPTIONS[0]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dispense Loading Step State
  const [dispenseProgressStep, setDispenseProgressStep] = useState<number>(-1);
  const [dispenseStatusText, setDispenseStatusText] = useState("");

  const handleDispense = async (pxId: string) => {
    if (dispenseProgressStep >= 0) return; // already dispensing
    
    // Multi-step animated verification sequence
    setDispenseProgressStep(0);
    setDispenseStatusText("Locating prescribing physician block metadata...");
    await new Promise((r) => setTimeout(r, 600));

    setDispenseProgressStep(1);
    setDispenseStatusText("Authenticating patient consent signature token...");
    await new Promise((r) => setTimeout(r, 700));

    setDispenseProgressStep(2);
    setDispenseStatusText("Auditing local pharmacy molecular inventory matrices...");
    await new Promise((r) => setTimeout(r, 600));

    setDispenseProgressStep(3);
    setDispenseStatusText("Publishing smart dispensation ledger block payload...");
    await new Promise((r) => setTimeout(r, 700));

    // Update state
    setPrescriptions((prev) =>
      prev.map((px) => {
        if (px.id === pxId) {
          const updatedPx: MockPrescription = { ...px, status: "DISPENSED" };
          // Keep selection synchronized
          if (selectedPx?.id === pxId) {
            setSelectedPx(updatedPx);
          }
          return updatedPx;
        }
        return px;
      })
    );

    setDispenseProgressStep(4);
    setDispenseStatusText("SUCCESS: Medication successfully dispensed and registered.");
    await new Promise((r) => setTimeout(r, 1200));
    setDispenseProgressStep(-1);
  };

  const filteredPx = prescriptions.filter((px) => {
    return (
      px.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      px.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      px.medicationName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div id="pharmacist-console" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Registered prescription list */}
        <div className="lg:col-span-7 space-y-4">
          <GlassCard glowColor="none" hoverable={false} className="p-5 bg-slate-950/40">
            <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display font-medium text-sm text-white">Sovereign Prescription Registry</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 font-semibold">Verify doctor credentials and sign medicine releases securely.</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-neon-cyan animate-pulse" />
            </div>

            {/* Search Input Bar */}
            <div className="relative mt-4 mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="pharmacist-px-search"
                type="text"
                placeholder="Search prescription database (Patient, ID, Medication)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-9.5 pr-4 py-2.5 font-mono text-xs text-slate-300 focus:outline-none focus:border-neon-cyan/80 font-medium"
              />
            </div>

            {/* List items block */}
            <div className="space-y-2.5">
              {filteredPx.map((px) => {
                const isSelected = selectedPx?.id === px.id;
                return (
                  <div
                    id={`px-item-${px.id}`}
                    key={px.id}
                    onClick={() => setSelectedPx(px)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                      isSelected
                        ? "bg-slate-950/90 border-neon-cyan/50"
                        : "bg-slate-950/20 border-slate-900/60 hover:border-slate-800"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 leading-none">
                        <span className="font-mono text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                          {px.id}
                        </span>
                        <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.25 rounded ${
                          px.status === "PENDING"
                            ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20 animate-pulse"
                            : "bg-neon-green/10 text-neon-green border border-neon-green/20"
                        }`}>
                          {px.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 mt-1">{px.medicationName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">Patient Nodes: {px.patientName}</p>
                    </div>

                    <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isSelected ? "translate-x-1 text-neon-cyan" : ""}`} />
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Detailed prescription preview & dispense action triggers */}
        <div className="lg:col-span-5">
          {selectedPx ? (
            <GlassCard glowColor="cyan" hoverable={false} className="p-6">
              <div className="border-b border-slate-900 pb-3 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-neon-cyan" />
                <div>
                  <h4 className="font-display font-bold text-xs text-slate-100">Verification Ledger Scope</h4>
                  <span className="font-mono text-[8.5px] text-slate-500 uppercase tracking-widest">{selectedPx.id}</span>
                </div>
              </div>

              <div className="mt-5 space-y-4 font-mono text-[10.5px]">
                {/* Details list */}
                <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-900/50 leading-relaxed text-slate-400">
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase font-black block tracking-wider">Target Patient Node</span>
                    <strong className="text-white text-[11.5px] font-display font-black block mt-0.5">{selectedPx.patientName}</strong>
                    <span className="text-[8px] text-slate-500 block truncate">{selectedPx.patientDid}</span>
                  </div>

                  <div className="border-t border-slate-900/60 pt-3">
                    <span className="text-[8px] text-slate-500 uppercase font-black block tracking-wider">Formulated Medical Substrate</span>
                    <strong className="text-neon-cyan font-bold block mt-0.5">{selectedPx.medicationName}</strong>
                    <p className="text-[10px] text-slate-500 mt-1 italic">{selectedPx.dosage}</p>
                  </div>

                  <div className="border-t border-slate-900/60 pt-3">
                    <span className="text-[8px] text-slate-500 uppercase font-black block tracking-wider">Prescribing Doctor</span>
                    <strong className="text-slate-300 font-semibold block mt-0.5">{selectedPx.prescribingDoctor}</strong>
                    <span className="text-[8.5px] text-slate-500 block truncate">{selectedPx.doctorDid}</span>
                  </div>

                  <div className="border-t border-slate-900/60 pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase font-black block tracking-wider">Signed Date</span>
                      <strong className="text-slate-400 block font-semibold mt-0.5">{selectedPx.dateSigned}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-slate-500 uppercase font-black block tracking-wider">Refills Remaining</span>
                      <strong className="text-slate-400 block font-semibold mt-0.5">{selectedPx.refillsLeft} refills</strong>
                    </div>
                  </div>

                  <div className="border-t border-slate-900/60 pt-3">
                    <span className="text-[8px] text-slate-500 uppercase font-black block tracking-wider">Cryptographic Consent Grant Token</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Lock className="w-3.5 h-3.5 text-neon-blue shrink-0" />
                      <span className="text-neon-blue text-[9px] font-bold block truncate">{selectedPx.consentGrantToken}</span>
                    </div>
                  </div>
                </div>

                {/* Animated dispensing progress loader widget */}
                <AnimatePresence>
                  {dispenseProgressStep >= 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0 }}
                      className="bg-slate-950 p-4.5 rounded-xl border border-neon-cyan/30 space-y-3.5"
                    >
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-neon-cyan" />
                        <span className="text-[10px] font-bold uppercase text-neon-cyan tracking-wider">Dispensation Verification Sequence</span>
                      </div>

                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full"
                          initial={{ width: "0%" }}
                          animate={{
                            width:
                              dispenseProgressStep === 0
                                ? "25%"
                                : dispenseProgressStep === 1
                                ? "50%"
                                : dispenseProgressStep === 2
                                ? "75%"
                                : dispenseProgressStep === 3
                                ? "90%"
                                : "100%"
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      <p className="text-[9.5px] text-slate-400 leading-normal font-mono animate-pulse">
                        {dispenseStatusText}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dispense Trigger Buttons */}
                {selectedPx.status === "PENDING" ? (
                  <button
                    id="pharmacist-dispense-submit-btn"
                    onClick={() => handleDispense(selectedPx.id)}
                    disabled={dispenseProgressStep >= 0}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-cyber-dark font-display font-black text-xs tracking-widest hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all cursor-pointer uppercase flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" /> Verify & Dispense Medication
                  </button>
                ) : (
                  <div className="bg-neon-green/5 border border-neon-green/30 p-4 rounded-xl flex items-center justify-center gap-2 text-neon-green font-bold text-xs uppercase leading-none">
                    <CheckCircle2 className="w-4.5 h-4.5 text-neon-green shrink-0" />
                    <span>Medication Dispelled & Logged</span>
                  </div>
                )}
              </div>
            </GlassCard>
          ) : (
            <div className="text-center py-12 font-mono text-xs text-slate-500">
              Select a prescription node from the registry list to audit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
