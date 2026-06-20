/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MedicalDocument {
  id: string;
  title: string;
  date: string;
  category: "Lab Reports" | "Prescriptions" | "Imaging" | "Doctor Notes" | "Insurance Documents";
  doctorName: string;
  facility: string;
  summary: string;
  details: string;
  ipfsHash: string;
  fileSize?: string;
}

const INITIAL_DOCUMENTS: MedicalDocument[] = [
  {
    id: "doc_001",
    title: "Full-Genome Genomic Resonance Sequencing",
    date: "2026-05-14 10:23 UTC",
    category: "Lab Reports",
    doctorName: "Dr. Elena Rostova",
    facility: "Neo-Biomedical Genomics Center",
    summary: "Complete sequencing of target patient genome. Epigenetic markers indicate 98.4% nominal DNA stability with elevated response markers on synaptic resilience genes.",
    details: "Haplogroup R1b sequence fully mapped. Single nucleotide polymorphisms (SNPs) on neural path markers reveal excellent receptor densities. Epigenetic aging index matching chronologic age -1.8 years. Zero pathogenic structural variations detected.",
    ipfsHash: "ipfs://QmYwAPzJnvdZFWzG62y393Az6yy9JpB8cK6R8XyE2b123a",
    fileSize: "12.4 MB"
  },
  {
    id: "doc_002",
    title: "Gamma Brainwave Resonance Core MRI Scan",
    date: "2026-06-02 18:41 UTC",
    category: "Imaging",
    doctorName: "Dr. Arthur Vance",
    facility: "Synapse Synthesis Neuro-Node",
    summary: "High-resolution neural resonance MRI. Real-time active tracking during 40Hz visual driving challenge.",
    details: "Deep temporal pathways tracked under stimulus. Neural coherence ratio shows balanced bilateral frontal-parietal connectivity. Emissive blue core activity confirms dense neuro-membrane integrity perfectly correlated with video-documented resonance bubble simulations.",
    ipfsHash: "ipfs://QmZt3uE9e9ZFWzG62y393Az6yy9JpB8cK6R8XyE2b998b",
    fileSize: "185.2 MB"
  },
  {
    id: "doc_003",
    title: "Neuro-Transmission Regulating Formula Prescr.",
    date: "2026-06-19 14:02 UTC",
    category: "Prescriptions",
    doctorName: "Dr. Cassandra Vance",
    facility: "Aetheric Synapsis Clinics",
    summary: "Pre-emptive chemical feedback formula designed to stabilize neural gamma-wave coherence indices under cognitive high-load periods.",
    details: "Formula: Synaptol-DX9 (Recombinant Peptide Catalyst). Dosage: 10mg dry inhaler capsule, once daily (Circadian zero index). Course: 90 days. Side profile: minor luminous visual traces.",
    ipfsHash: "ipfs://QmTt4vR8e8ZFWzG62y393Az6yy9JpB8cK6R8XyE2b442c",
    fileSize: "14.2 KB"
  },
  {
    id: "doc_004",
    title: "Sub-optimal Metabolic Trend Analysis Notes",
    date: "2026-06-08 21:05 UTC",
    category: "Doctor Notes",
    doctorName: "Dr. Marcus Sterling",
    facility: "Precision Longevity Hub",
    summary: "Periodic review of real-time wearable ledger telemetry. Moderate post-prandial glycemic excursions.",
    details: "Patient is requested to increase hydration and utilize low-frequency acoustic neural driving patterns before nocturnal transitions to improve sleep depth. Cardiac heart-rate variability (HRV) is outstanding (average 95ms).",
    ipfsHash: "ipfs://QmRt5xS8X8ZFWzG62y393Az6yy9JpB8cK6R8XyE2b115d",
    fileSize: "45.1 KB"
  },
  {
    id: "doc_005",
    title: "Sovereign Network Mutual-Assurance Coverage Plan",
    date: "2026-01-10 09:00 UTC",
    category: "Insurance Documents",
    doctorName: "Vital Twin Underwriters Node",
    facility: "Mutual Cybernetic Assurance Corp",
    summary: "Sovereign cryptographic health risk assurance protocol policy v9.1.",
    details: "Assures coverage for genomic therapy, quantum molecular synthesis, and high-resolution synapse scans. Dynamic premium adjustment active: Premium is locked at minimum tier -40% in reward for the patient sharing fully anonymized continuous vitals streams.",
    ipfsHash: "ipfs://QmPt6wQ8e8ZFWzG62y393Az6yy9JpB8cK6R8XyE2b558f",
    fileSize: "2.8 MB"
  }
];

let localDocuments = [...INITIAL_DOCUMENTS];

export const recordsService = {
  getDocuments: async (): Promise<MedicalDocument[]> => {
    // Promise-based network delay simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...localDocuments]);
      }, 600);
    });
  },

  uploadDocument: async (doc: Omit<MedicalDocument, "id" | "ipfsHash">): Promise<MedicalDocument> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const id = "doc_" + Math.random().toString(36).substring(2, 9);
        const randomHash = "ipfs://Qm" + Math.random().toString(36).substring(2, 15) + "xyz" + Math.random().toString(36).substring(2, 8);
        const newDoc: MedicalDocument = {
          ...doc,
          id,
          ipfsHash: randomHash,
        };
        localDocuments = [newDoc, ...localDocuments];
        resolve(newDoc);
      }, 1500); // Fluid loading animation simulation looks best with slight upload delay
    });
  }
};
