/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  UserCheck,
  ShieldAlert,
  Loader2,
  FilePlus2,
  Pill,
  Award,
  Signature,
  FileBadge2,
  User,
  Activity,
  PlusCircle,
  Clock,
  Code
} from "lucide-react";
import GlassCard from "../../components/GlassCard";

interface PatientNode {
  name: string;
  did: string;
  age: number;
  lastCoherence: string;
  status: "AUTHORIZED" | "PENDING_VERIFICATION" | "REVOKED";
  heartRate: number;
}

interface FormPrescription {
  patientDid: string;
  patientName: string;
  medicine: string;
  dosage: string;
  duration: string;
  directiveNotes: string;
}

export default function DoctorDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientDid, setSelectedPatientDid] = useState("did:vitaltwin:ipns:8f2a9e31dcdc6bf71b4eef2");
  
  // Custom generated prescription list
  const [generatedPrescription, setGeneratedPrescription] = useState<FormPrescription | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form Fields State
  const [formMedicine, setFormMedicine] = useState("Synaptol-DX9");
  const [formDosage, setFormDosage] = useState("10mg dry capsule inhalation pre-circadian index 0");
  const [formDuration, setFormDuration] = useState("90 Cycles / Days");
  const [formNotes, setFormNotes] = useState("Optimal formula targeting frontal-lobe gamma stability coherence indices. Take with pure alkaline water.");

  const [patientsList, setPatientsList] = useState<PatientNode[]>([
    {
      name: "Sovereign Patient (Hyperbrother)",
      did: "did:vitaltwin:ipns:8f2a9e31dcdc6bf71b4eef2",
      age: 29,
      lastCoherence: "99.2% Nominal Stability",
      status: "AUTHORIZED",
      heartRate: 72,
    },
    {
      name: "Patient Node 2 (Elena Rostova)",
      did: "did:vitaltwin:ipns:0ab0e39c71bc9d8fddb9a527",
      age: 34,
      lastCoherence: "94.6% Stable",
      status: "AUTHORIZED",
      heartRate: 68,
    },
    {
      name: "Patient Node 3 (Arthur Vance)",
      did: "did:vitaltwin:ipns:df21ebc87c9f8090bdc92da1",
      age: 61,
      lastCoherence: "88.1% Core Coherence",
      status: "PENDING_VERIFICATION",
      heartRate: 81,
    },
    {
      name: "Patient Node 4 (Cassandra Sterling)",
      did: "did:vitaltwin:ipns:fe2a3f0dcba918ea8e24c7",
      age: 42,
      lastCoherence: "Revoked Sovereign Consent",
      status: "REVOKED",
      heartRate: 0,
    }
  ]);

  // Handle active status toggle (Request Handshake / Revoke link)
  const handleToggleAccess = (did: string) => {
    setPatientsList((prev) =>
      prev.map((pat) => {
        if (pat.did === did) {
          const nextStatus =
            pat.status === "AUTHORIZED"
              ? "REVOKED"
              : pat.status === "REVOKED"
              ? "PENDING_VERIFICATION"
              : "AUTHORIZED";
          return { ...pat, status: nextStatus };
        }
        return pat;
      })
    );
  };

  const currentSelectedPatient = patientsList.find(p => p.did === selectedPatientDid) || patientsList[0];

  // Prescription validation & generation simulation
  const handleGeneratePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedPrescription(null);

    // Simulate key seal and digital token compilation
    await new Promise((resolve) => setTimeout(resolve, 1400));

    setGeneratedPrescription({
      patientDid: selectedPatientDid,
      patientName: currentSelectedPatient.name,
      medicine: formMedicine,
      dosage: formDosage,
      duration: formDuration,
      directiveNotes: formNotes
    });
    
    setIsGenerating(false);
  };

  // Autocomplete templates for ease of clinical operations
  const loadTemplate = (med: string) => {
    if (med === "Synaptol-DX9") {
      setFormMedicine("Synaptol-DX9");
      setFormDosage("10mg dry capsule inhalation pre-circadian index 0");
      setFormDuration("90 Cycles / Days");
      setFormNotes("Optimal formula targeting frontal-lobe gamma stability coherence indices. Take with pure alkaline water.");
    } else if (med === "Somnium-V7") {
      setFormMedicine("Somnium-V7 (Deep Sleep Catalyst)");
      setFormDosage("5ml liquid sublingual 30 mins before nocturnal transition");
      setFormDuration("30 Cycles");
      setFormNotes("Stabilizes delta core oscillations. Do not operate quantum machinery within 8 hours of administration.");
    } else {
      setFormMedicine("Oxytone-Neuro Plus");
      setFormDosage("1 capsule with midday nutritional intake cycle");
      setFormDuration("120 Cycles / Days");
      setFormNotes("Boosts peripheral metabolic uptake and synaptic oxygenation. Keeps energy parameters linear.");
    }
  };

  const filteredPatients = patientsList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.did.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="doctor-dashboard-main" className="space-y-6">
      
      {/* Upper overview stats header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-center">
        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-[8px] text-slate-500 uppercase tracking-widest">ACTIVE_HEALTH_LINKS</span>
          <p className="text-xl font-bold text-neon-cyan mt-1">
            {patientsList.filter(p => p.status === 'AUTHORIZED').length} Operational
          </p>
        </div>
        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-[8px] text-slate-500 uppercase tracking-widest">PENDING_CONSENT_GRANTS</span>
          <p className="text-xl font-bold text-neon-purple mt-1">
            {patientsList.filter(p => p.status === 'PENDING_VERIFICATION').length} Requests
          </p>
        </div>
        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-[8px] text-slate-500 uppercase tracking-widest">DIGITAL_PRESCR_CIPHERS</span>
          <p className="text-xl font-bold text-white mt-1">SHA256 MultiSign</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Patient Search & Access Manager */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard glowColor="none" hoverable={false} className="p-5 flex flex-col gap-4 bg-slate-950/40">
            <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-white">Operator Access Manager</h3>
              <span className="text-[8px] font-mono border border-neon-cyan/20 text-neon-cyan px-1.5 py-0.5 rounded uppercase font-bold">Clinical Level 4</span>
            </div>

            {/* Quick Filter Search Box */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                id="doc-patient-search"
                type="text"
                placeholder="Search patient node or DID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-900 rounded-xl pl-9 pr-4 py-2 font-mono text-[11px] text-slate-300 focus:outline-none focus:border-neon-cyan transition-all"
              />
            </div>

            {/* Patients and Link Authorization List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredPatients.map((patient) => {
                const isSelected = selectedPatientDid === patient.did;
                return (
                  <div
                    key={patient.did}
                    onClick={() => {
                      if (patient.status === "AUTHORIZED") {
                        setSelectedPatientDid(patient.did);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? "bg-neon-cyan/5 border-neon-cyan/40"
                        : "bg-slate-950/50 border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800 shrink-0">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="min-w-0 leading-tight">
                          <h4 className="text-xs font-bold text-slate-200 truncate">{patient.name}</h4>
                          <span className="font-mono text-[8px] text-slate-500 truncate block mt-0.5">{patient.did}</span>
                        </div>
                      </div>

                      {/* Status pill badges */}
                      <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                        patient.status === "AUTHORIZED"
                          ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                          : patient.status === "PENDING_VERIFICATION"
                          ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20 animate-pulse"
                          : "bg-red-950/20 text-red-400 border border-red-900/20"
                      }`}>
                        {patient.status}
                      </span>
                    </div>

                    {/* Vitals snapshot if authorized */}
                    {patient.status === "AUTHORIZED" && (
                      <div className="flex items-center justify-between font-mono text-[8px] bg-slate-950 p-2 rounded-lg border border-slate-900/60 text-slate-400 mt-1">
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-neon-cyan" />
                          <span>Pulse: <strong className="text-slate-200">{patient.heartRate || 72} BPM</strong></span>
                        </div>
                        <span>Coherence: <strong className="text-neon-cyan">{patient.lastCoherence}</strong></span>
                      </div>
                    )}

                    {/* Handshake management button block */}
                    <div className="flex items-center justify-end border-t border-slate-900/40 pt-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleToggleAccess(patient.did)}
                        className={`font-mono text-[9px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer uppercase ${
                          patient.status === "AUTHORIZED"
                            ? "bg-red-950/10 border-red-900/30 text-red-400 hover:bg-red-950/30"
                            : patient.status === "REVOKED"
                            ? "bg-neon-green/10 border-neon-green/30 text-neon-green hover:bg-neon-green/20"
                            : "bg-neon-purple/10 border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20"
                        }`}
                      >
                        {patient.status === "AUTHORIZED"
                          ? "Sever Telemetry Link"
                          : patient.status === "REVOKED"
                          ? "Request Telemetry Handshake"
                          : "Approve Integration Token"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Prescription Builder form */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard glowColor="purple" hoverable={false} className="p-6">
            <div className="border-b border-slate-900 pb-4 mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-base text-white">Sovereign Prescription Builder</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Author cryptographic medical instructions signed in local Ledger block.</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-900">
                <FilePlus2 className="w-4 h-4 text-neon-purple" />
              </div>
            </div>

            {/* Quick Templates shortcuts */}
            <div className="mb-4">
              <label className="font-mono text-[8px] text-slate-500 uppercase tracking-wider block mb-2">QUICK COGNITIVE TEMPLATES</label>
              <div className="flex flex-wrap gap-2">
                {["Synaptol-DX9", "Somnium-V7", "Oxytone-Neuro Plus"].map((med) => (
                  <button
                    key={med}
                    type="button"
                    onClick={() => loadTemplate(med)}
                    className="font-mono text-[9px] px-3 py-1.5 rounded-lg border border-slate-900 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-800 cursor-pointer"
                  >
                    {med}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGeneratePrescription} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target Patient */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-slate-400 uppercase tracking-wide">TARGET_RECEIVER_DID</label>
                  <input
                    type="text"
                    disabled
                    value={currentSelectedPatient.did}
                    className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-3.5 py-2.5 font-mono text-[11px] text-slate-500 select-all cursor-not-allowed"
                  />
                </div>

                {/* Medicine / Substrate name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-slate-400 uppercase tracking-wide">CIPHER_MEDICINE_NAME</label>
                  <input
                    type="text"
                    required
                    value={formMedicine}
                    onChange={(e) => setFormMedicine(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dosage protocol */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-slate-400 uppercase tracking-wide">DOSAGE_PROTOCOL</label>
                  <input
                    type="text"
                    required
                    value={formDosage}
                    onChange={(e) => setFormDosage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>

                {/* Duration course */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-slate-400 uppercase tracking-wide">TIME_DURATION_COURSE</label>
                  <input
                    type="text"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-neon-purple transition-all"
                  />
                </div>
              </div>

              {/* Directive Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-slate-400 uppercase tracking-wide">CLINICAL_OPERATIONS_NOTES</label>
                <textarea
                  required
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-neon-purple transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Submit trigger button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-purple to-[#8a00ff] hover:to-white text-white hover:text-cyber-dark font-display font-black text-xs tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(189,0,255,0.4)] uppercase"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Sealing Key block signature...</span>
                  </>
                ) : (
                  <>
                    <Signature className="w-4 h-4" />
                    <span>Seal & Generate Token Certificate</span>
                  </>
                )}
              </button>
            </form>
          </GlassCard>

          {/* Render digital prescription container if successfully compiled */}
          <AnimatePresence>
            {generatedPrescription && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ type: "spring", stiffness: 85, damping: 13 }}
              >
                <GlassCard glowColor="cyan" hoverable={false} className="p-6 relative overflow-hidden bg-slate-950/80 border-2 border-neon-cyan/40">
                  {/* Glowing decorative laser borders */}
                  <div className="absolute top-0 right-0 w-32 h-[1px] bg-gradient-to-l from-neon-cyan to-transparent" />
                  <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-gradient-to-r from-neon-cyan to-transparent" />

                  {/* Aesthetic card header */}
                  <div className="flex items-start justify-between border-b border-dashed border-slate-800 pb-4 mb-4 select-all">
                    <div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-neon-cyan" />
                        <span className="font-mono text-[9px] text-neon-cyan font-bold tracking-widest uppercase">LEDGER_SIGNATURE_VERIFIED</span>
                      </div>
                      <h4 className="font-display font-black text-sm text-white mt-1 uppercase">Sovereign Medical Token</h4>
                    </div>

                    {/* QR Code and Blockchain credentials mockup */}
                    <div className="w-12 h-12 bg-white rounded-lg p-1.5 shrink-0 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                      <Code className="w-full h-full text-slate-950 animate-pulse" />
                    </div>
                  </div>

                  {/* Core details of active prescription token */}
                  <div className="space-y-4 font-mono text-[11px] leading-relaxed text-slate-300">
                    <div>
                      <span className="text-slate-500 block uppercase text-[8px] tracking-wider">RECIPIENT_NODE</span>
                      <strong className="text-slate-200">{generatedPrescription.patientName}</strong>
                      <span className="text-slate-500 block text-[9px] truncate">{generatedPrescription.patientDid}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-900/50">
                      <div>
                        <span className="text-slate-500 block uppercase text-[8px] tracking-wider font-bold">SUBSTRATE_FORMULA</span>
                        <div className="flex items-center gap-1 text-neon-cyan font-bold block mt-0.5">
                          <Pill className="w-3.5 h-3.5" />
                          <span>{generatedPrescription.medicine}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase text-[8px] tracking-wider">ACTIVE_CYCLE</span>
                        <div className="flex items-center gap-1 text-white block mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{generatedPrescription.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-900/50">
                      <span className="text-slate-500 block uppercase text-[8px] tracking-wider">SEALED_DOSAGE_PROTOCOL</span>
                      <p className="text-xs text-slate-200 italic font-mono mt-0.5 leading-snug">{generatedPrescription.dosage}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-900/50 bg-slate-950/40 p-3 rounded-lg border border-slate-900/60 text-slate-400">
                      <span className="text-slate-500 block uppercase text-[8px] tracking-wider font-bold">CLINICAL_DIRECTIVES</span>
                      <p className="text-[10px] mt-1 leading-relaxed">{generatedPrescription.directiveNotes}</p>
                    </div>
                  </div>

                  {/* Blockchain gas / seal index signature footer */}
                  <div className="mt-5 pt-4 border-t border-dashed border-slate-800 flex items-center justify-between font-mono text-[8px] text-slate-500 leading-none">
                    <div>
                      <span>TX_HEX_BLOCK:</span>
                      <span className="text-slate-400 block font-semibold mt-0.5 truncate max-w-[170px]">
                        0x7fa2b9e31dcdc6bf71b4eef2e75dcba811bda313d90ec60d
                      </span>
                    </div>

                    <div className="text-right">
                      <span>GAS_FEES:</span>
                      <span className="text-neon-cyan block font-bold mt-0.5">0.00018 VTX</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
