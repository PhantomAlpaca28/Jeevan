/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SovereignCredential,
  BiometricStream,
  MedicalDiagnosticRecord,
  ConsentPermission,
  BlockTransaction
} from "../types";

// Helper to generate mock SHA-256 IPFS hashes
function generateMockHash(): string {
  const characters = "0123456789abcdef";
  let hash = "Qm";
  for (let i = 0; i < 44; i++) {
    hash += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return hash;
}

const INITIAL_CREDENTIALS: SovereignCredential = {
  did: "did:vortexa:ipns:8f2a9e31dcdc6bf71b4eef2",
  publicKey: "04:6cf7:1e9a:cdb1:7245:bf8a:29d3:0f91:8e57:9982:1c67:e2a8:440c:5601:9bb4:aa20",
  privateKeyWIF: "vx_prv_key_9fca883e002de45b88c7f920da781e6992dca21817bbbf0a",
  signingAlgorithm: "Ed25519",
  authStatus: "VERIFIED",
  healthScore: 88,
  vtxCredits: 342.50
};

const INITIAL_RECORDS: MedicalDiagnosticRecord[] = [
  {
    id: "rec-gen-001",
    timestamp: "2026-06-18 14:32:01",
    originNode: "Vortexa Neural Sequencing Lab Node 4",
    category: "GENOMIC",
    diagnosticSummary: "Epi-genomic micro-metabolism profile synthesized successfully.",
    clinicalNarrative: "DNA methylation analysis reveals high adaptive capacity for high-density neural sequencing tasks. Elevated markers on chromosome 7 indicate moderate antioxidant resistance; prescription recommending omega-3 phospholipid lipid replacement protocol.",
    severity: "NOMINAL",
    isEncrypted: false,
    integrityHash: "Qm6f5a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c"
  },
  {
    id: "rec-neuro-002",
    timestamp: "2026-06-19 09:15:44",
    originNode: "Quantum Neuro-imaging Node 17",
    category: "NEURO-SYNAPTIC",
    diagnosticSummary: "Hyper-coherent gamma-wave burst detected with high neuroplasticity profile.",
    clinicalNarrative: "EEG feedback mapping shows localized gamma burst synchronicity at 40Hz within prefrontal synapsis. Coherence index is exceptional, mirroring deep flow-state trigger conditions. No signs of pathological synaptic fatigue. Patient sovereignty key accepted.",
    severity: "NOMINAL",
    isEncrypted: false,
    integrityHash: "Qm8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7"
  },
  {
    id: "rec-meta-003",
    timestamp: "2026-06-20 01:10:00",
    originNode: "Bio-Implantable Micro-Telemetry (Sovereign Sync)",
    category: "METABOLIC",
    diagnosticSummary: "Metabolic glucose circadian excursion recorded outside baseline.",
    clinicalNarrative: "Continuous interstitial glucose scanning indicates minor dawn-phenomenon excursion peaking at 122 mg/dL with rapid automatic insulin homeostasis. Cellular performance remains inside highly efficient metabolic bounds. Sync fully authenticated.",
    severity: "ELEVATED",
    isEncrypted: true,
    decryptionKeyId: "key-sec-08",
    integrityHash: "Qm0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d"
  }
];

const INITIAL_CONSENTS: ConsentPermission[] = [
  {
    id: "con-001",
    entityName: "VORTEXA Medical Diagnostic Agent V4 (AI)",
    entityType: "AI_DIAGNOSTIC_AGENT",
    scope: "FULL_OMNI_ACCESS",
    expiresAt: "2500-01-01 00:00:00",
    isSessionTokenActive: true,
    vtxStakingReward: 0.05
  },
  {
    id: "con-002",
    entityName: "Hale-Glaxo Bio-Research Labs (Researcher Consortium)",
    entityType: "RESEARCH_CONSOR_PHARMA",
    scope: "ANONYMIZED_AGGREGATE",
    expiresAt: "2026-12-31 23:59:59",
    isSessionTokenActive: true,
    vtxStakingReward: 0.15
  },
  {
    id: "con-003",
    entityName: "Neo-Aegis Digital Trauma Center",
    entityType: "PRIMARY_CARE_HOSPITAL",
    scope: "NEURAL_ONLY",
    expiresAt: "2026-08-15 12:00:00",
    isSessionTokenActive: false,
    vtxStakingReward: 0.08
  },
  {
    id: "con-004",
    entityName: "Apex Cyber-Health Insurance Guild",
    entityType: "INSURANCE_NODE",
    scope: "REVOKED",
    expiresAt: "Expired",
    isSessionTokenActive: false,
    vtxStakingReward: 0.0
  }
];

const INITIAL_TXS: BlockTransaction[] = [
  {
    id: "tx-7741",
    blockHeight: 641203,
    timestamp: "2026-06-20 06:40:12",
    actionType: "KEY_ROTATION",
    txHash: "0x7a2c9f...d491eb01",
    gasTokens: 0.012
  },
  {
    id: "tx-7740",
    blockHeight: 641198,
    timestamp: "2026-06-20 05:22:45",
    actionType: "CONSENT_GRANT",
    txHash: "0x3bc1e2...f9e0ab23",
    gasTokens: 0.008
  },
  {
    id: "tx-7739",
    blockHeight: 641154,
    timestamp: "2026-06-19 23:14:11",
    actionType: "DATA_ENCRYPT",
    txHash: "0xdf109a...110bfedc",
    gasTokens: 0.015
  }
];

export class HealthNetworkService {
  private credential = { ...INITIAL_CREDENTIALS };
  private records = [...INITIAL_RECORDS];
  private consents = [...INITIAL_CONSENTS];
  private transactions = [...INITIAL_TXS];
  private currentBlockHeight = 641203;

  private activeTimer: any = null;

  constructor() {}

  // Simulates an API delay
  private delay(ms = 800): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getCredentials(): Promise<SovereignCredential> {
    await this.delay(500);
    return { ...this.credential };
  }

  async rotateSovereignKeys(): Promise<SovereignCredential> {
    await this.delay(1200); // cryptographic signing delay
    const hex = "0123456789abcdef";
    let newPK = "04:";
    for (let i = 0; i < 15; i++) {
       newPK += Array.from({length: 4}, () => hex[Math.floor(Math.random() * 16)]).join("") + ":";
    }
    newPK += "edc8";
    
    let newPrv = "vx_prv_key_";
    for (let i = 0; i < 48; i++) {
      newPrv += hex[Math.floor(Math.random() * 16)];
    }

    this.credential.publicKey = newPK;
    this.credential.privateKeyWIF = newPrv;
    this.credential.authStatus = "VERIFIED";
    
    // Add transaction log
    this.currentBlockHeight += 1;
    this.transactions.unshift({
      id: `tx-${Math.floor(Math.random() * 10000)}`,
      blockHeight: this.currentBlockHeight,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actionType: "KEY_ROTATION",
      txHash: "0x" + Array.from({length: 16}, () => hex[Math.floor(Math.random() * 16)]).join(""),
      gasTokens: 0.012
    });

    return { ...this.credential };
  }

  async getDiagnosticLogs(): Promise<MedicalDiagnosticRecord[]> {
    await this.delay(600);
    return [...this.records];
  }

  async encryptDiagnosticLog(id: string): Promise<boolean> {
    await this.delay(800);
    const index = this.records.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.records[index].isEncrypted = true;
      this.records[index].decryptionKeyId = `key-sec-${Math.floor(Math.random() * 90) + 10}`;
      
      // Add transaction log
      this.currentBlockHeight += 1;
      this.transactions.unshift({
        id: `tx-${Math.floor(Math.random() * 10000)}`,
        blockHeight: this.currentBlockHeight,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        actionType: "DATA_ENCRYPT",
        txHash: "0x" + Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join(""),
        gasTokens: 0.015
      });
      return true;
    }
    return false;
  }

  async decryptDiagnosticLog(id: string): Promise<boolean> {
    await this.delay(850); // cryptographic decryption validation
    const index = this.records.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.records[index].isEncrypted = false;
      this.records[index].decryptionKeyId = undefined;
      return true;
    }
    return false;
  }

  async getConsents(): Promise<ConsentPermission[]> {
    await this.delay(400);
    return [...this.consents];
  }

  async updateConsentScope(id: string, newScope: ConsentPermission["scope"]): Promise<ConsentPermission[]> {
    await this.delay(700);
    const index = this.consents.findIndex((c) => c.id === id);
    if (index !== -1) {
      const oldScope = this.consents[index].scope;
      this.consents[index].scope = newScope;
      this.consents[index].isSessionTokenActive = newScope !== "REVOKED";
      
      // Update staking credit generation based on scope
      if (newScope === "FULL_OMNI_ACCESS") this.consents[index].vtxStakingReward = 0.22;
      else if (newScope === "ANONYMIZED_AGGREGATE") this.consents[index].vtxStakingReward = 0.15;
      else if (newScope === "NEURAL_ONLY") this.consents[index].vtxStakingReward = 0.08;
      else this.consents[index].vtxStakingReward = 0.0;

      // Add transaction log
      this.currentBlockHeight += 1;
      this.transactions.unshift({
        id: `tx-${Math.floor(Math.random() * 10000)}`,
        blockHeight: this.currentBlockHeight,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        actionType: newScope === "REVOKED" ? "CONSENT_REVOKE" : "CONSENT_GRANT",
        txHash: "0x" + Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join(""),
        gasTokens: 0.011
      });
    }
    return [...this.consents];
  }

  async getTransactions(): Promise<BlockTransaction[]> {
    await this.delay(500);
    return [...this.transactions];
  }

  // Live real-time biometric feed streamer simulation
  startLiveBiometrics(callback: (stream: BiometricStream, healthScore: number, vtxCredits: number) => void): void {
    if (this.activeTimer) clearInterval(this.activeTimer);

    let baseSpO2 = 98;
    let baseGlucose = 96;
    let baseBrainwaves = 40.2; // gamma Hz
    
    // Periodically pulse streaming biometric data
    this.activeTimer = setInterval(() => {
      // Small randomized fluctuate within healthy ranges
      const heartRate = Math.floor(66 + Math.sin(Date.now() / 10000) * 8 + Math.random() * 4);
      const bloodOxygen = Math.min(100, Math.max(95, baseSpO2 + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)));
      const bloodGlucose = Math.floor(baseGlucose + Math.cos(Date.now() / 25000) * 12 + Math.random() * 3);
      const neuralCoherence = +(baseBrainwaves + Math.sin(Date.now() / 5000) * 3 + Math.random() * 0.8).toFixed(1);
      const bodyTemp = +(36.6 + Math.sin(Date.now() / 15000) * 0.2 + Math.random() * 0.05).toFixed(2);
      const respiratoryRate = Math.floor(12 + Math.cos(Date.now() / 8000) * 2 + Math.random());

      // Slow dynamic increase to VTX Staking token based on active sharing nodes
      const activeShares = this.consents.filter(c => c.isSessionTokenActive && c.scope !== "REVOKED");
      const rewardRate = activeShares.reduce((acc, curr) => acc + curr.vtxStakingReward, 0);
      
      this.credential.vtxCredits = +(this.credential.vtxCredits + (rewardRate / 60)).toFixed(4);
      
      // Calculate active health score dynamically based on biometric harmony
      const hrDeviation = Math.abs(heartRate - 70) / 70;
      const spo2Diff = (100 - bloodOxygen) * 2;
      const glucDeviation = Math.abs(bloodGlucose - 95) / 95;
      const ncHarmonic = Math.abs(neuralCoherence - 40) / 40;
      const dynamicScore = Math.floor(96 - (hrDeviation * 15 + spo2Diff * 2 + glucDeviation * 10 + ncHarmonic * 5));
      this.credential.healthScore = Math.min(100, Math.max(60, dynamicScore));

      callback({
        timestamp: new Date().toLocaleTimeString(),
        heartRate,
        bloodOxygen,
        bloodGlucose,
        neuralCoherence,
        bodyTemp,
        respiratoryRate
      }, this.credential.healthScore, this.credential.vtxCredits);
    }, 1500);
  }

  stopLiveBiometrics(): void {
    if (this.activeTimer) {
      clearInterval(this.activeTimer);
      this.activeTimer = null;
    }
  }

  // Simulate injecting a new simulated healthcare event
  async claimAirdropToken(): Promise<SovereignCredential> {
    await this.delay(1000);
    this.credential.vtxCredits += 50.0;
    
    // Add ledger transaction
    this.currentBlockHeight += 1;
    this.transactions.unshift({
      id: `tx-${Math.floor(Math.random() * 10000)}`,
      blockHeight: this.currentBlockHeight,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actionType: "REWARD_CLAIMS",
      txHash: "0x" + Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      gasTokens: 0.0
    });
    
    return { ...this.credential };
  }
}

export const healthServiceInstance = new HealthNetworkService();
