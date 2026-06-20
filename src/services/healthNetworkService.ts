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
  did: "did:vitaltwin:ipns:8f2a9e31dcdc6bf71b4eef2",
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
    originNode: "Vital Twin Neural Sequencing Lab Node 4",
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
    entityName: "VITAL TWIN Medical Diagnostic Agent V4 (AI)",
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

import { auth, db, OperationType, handleFirestoreError } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";

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
    await this.delay(300);
    const user = auth.currentUser;
    if (user) {
      try {
        const snap = await getDoc(doc(db, "credentials", user.uid));
        if (snap.exists()) {
          const remoteCred = snap.data();
          this.credential = {
            did: remoteCred.did || this.credential.did,
            publicKey: remoteCred.publicKey || this.credential.publicKey,
            privateKeyWIF: remoteCred.privateKeyWIF || this.credential.privateKeyWIF,
            signingAlgorithm: remoteCred.signingAlgorithm || this.credential.signingAlgorithm,
            authStatus: remoteCred.authStatus || this.credential.authStatus,
            healthScore: remoteCred.healthScore !== undefined ? remoteCred.healthScore : this.credential.healthScore,
            vtxCredits: remoteCred.vtxCredits !== undefined ? remoteCred.vtxCredits : this.credential.vtxCredits
          };
        }
      } catch (err) {
        console.error("Failed to load credentials from Firestore", err);
      }
    }
    return { ...this.credential };
  }

  async rotateSovereignKeys(): Promise<SovereignCredential> {
    await this.delay(1000); // cryptographic signing delay
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
    
    this.currentBlockHeight += 1;
    const newTx: BlockTransaction = {
      id: `tx-${Math.floor(Math.random() * 10000)}`,
      blockHeight: this.currentBlockHeight,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actionType: "KEY_ROTATION",
      txHash: "0x" + Array.from({length: 16}, () => hex[Math.floor(Math.random() * 16)]).join(""),
      gasTokens: 0.012,
      userId: auth.currentUser?.uid || "mock"
    };
    
    this.transactions.unshift(newTx);

    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, "credentials", user.uid), {
          publicKey: newPK,
          privateKeyWIF: newPrv,
          authStatus: "VERIFIED"
        });
        await setDoc(doc(db, "transactions", newTx.id), newTx);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `credentials/${user.uid}`);
      }
    }

    return { ...this.credential };
  }

  async getDiagnosticLogs(): Promise<MedicalDiagnosticRecord[]> {
    await this.delay(400);
    const user = auth.currentUser;
    if (user) {
      try {
        // Query user's logs
        const q = query(collection(db, "records"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const list: MedicalDiagnosticRecord[] = [];
        snap.forEach((doc) => {
          list.push(doc.data() as MedicalDiagnosticRecord);
        });
        if (list.length > 0) {
          this.records = list;
        }
      } catch (err) {
        console.error("Failed to load records from Firestore", err);
      }
    }
    return [...this.records];
  }

  async encryptDiagnosticLog(id: string): Promise<boolean> {
    await this.delay(600);
    const index = this.records.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.records[index].isEncrypted = true;
      const keyId = `key-sec-${Math.floor(Math.random() * 90) + 10}`;
      this.records[index].decryptionKeyId = keyId;
      
      this.currentBlockHeight += 1;
      const newTx: BlockTransaction = {
        id: `tx-${Math.floor(Math.random() * 10000)}`,
        blockHeight: this.currentBlockHeight,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        actionType: "DATA_ENCRYPT",
        txHash: "0x" + Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join(""),
        gasTokens: 0.015,
        userId: auth.currentUser?.uid || "mock"
      };
      
      this.transactions.unshift(newTx);

      const user = auth.currentUser;
      if (user) {
        try {
          await updateDoc(doc(db, "records", id), {
            isEncrypted: true,
            decryptionKeyId: keyId
          });
          await setDoc(doc(db, "transactions", newTx.id), newTx);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `records/${id}`);
        }
      }
      return true;
    }
    return false;
  }

  async decryptDiagnosticLog(id: string): Promise<boolean> {
    await this.delay(600);
    const index = this.records.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.records[index].isEncrypted = false;
      this.records[index].decryptionKeyId = undefined;

      const user = auth.currentUser;
      if (user) {
        try {
          await updateDoc(doc(db, "records", id), {
            isEncrypted: false,
            decryptionKeyId: null
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `records/${id}`);
        }
      }
      return true;
    }
    return false;
  }

  async getConsents(): Promise<ConsentPermission[]> {
    await this.delay(300);
    const user = auth.currentUser;
    if (user) {
      try {
        const q = query(collection(db, "consents"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const list: ConsentPermission[] = [];
        snap.forEach((doc) => {
          list.push(doc.data() as ConsentPermission);
        });
        if (list.length > 0) {
          this.consents = list;
        }
      } catch (err) {
        console.error("Failed to load consents from Firestore", err);
      }
    }
    return [...this.consents];
  }

  async updateConsentScope(id: string, newScope: ConsentPermission["scope"]): Promise<ConsentPermission[]> {
    await this.delay(500);
    const index = this.consents.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.consents[index].scope = newScope;
      this.consents[index].isSessionTokenActive = newScope !== "REVOKED";
      
      let reward = 0.0;
      if (newScope === "FULL_OMNI_ACCESS") reward = 0.22;
      else if (newScope === "ANONYMIZED_AGGREGATE") reward = 0.15;
      else if (newScope === "NEURAL_ONLY") reward = 0.08;

      this.consents[index].vtxStakingReward = reward;
      
      this.currentBlockHeight += 1;
      const newTx: BlockTransaction = {
        id: `tx-${Math.floor(Math.random() * 10000)}`,
        blockHeight: this.currentBlockHeight,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        actionType: newScope === "REVOKED" ? "CONSENT_REVOKE" : "CONSENT_GRANT",
        txHash: "0x" + Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join(""),
        gasTokens: 0.011,
        userId: auth.currentUser?.uid || "mock"
      };
      
      this.transactions.unshift(newTx);

      const user = auth.currentUser;
      if (user) {
        try {
          await updateDoc(doc(db, "consents", id), {
            scope: newScope,
            isSessionTokenActive: newScope !== "REVOKED",
            vtxStakingReward: reward
          });
          await setDoc(doc(db, "transactions", newTx.id), newTx);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `consents/${id}`);
        }
      }
    }
    return [...this.consents];
  }

  async getTransactions(): Promise<BlockTransaction[]> {
    await this.delay(300);
    const user = auth.currentUser;
    if (user) {
      try {
        const q = query(collection(db, "transactions"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const list: BlockTransaction[] = [];
        snap.forEach((doc) => {
          list.push(doc.data() as BlockTransaction);
        });
        if (list.length > 0) {
          this.transactions = list;
        }
      } catch (err) {
        console.error("Failed to load transactions from Firestore", err);
      }
    }
    return [...this.transactions];
  }

  startLiveBiometrics(callback: (stream: BiometricStream, healthScore: number, vtxCredits: number) => void): void {
    if (this.activeTimer) clearInterval(this.activeTimer);

    let baseSpO2 = 98;
    let baseGlucose = 96;
    let baseBrainwaves = 40.2; // gamma Hz
    
    this.activeTimer = setInterval(async () => {
      const heartRate = Math.floor(66 + Math.sin(Date.now() / 10000) * 8 + Math.random() * 4);
      const bloodOxygen = Math.min(100, Math.max(95, baseSpO2 + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)));
      const bloodGlucose = Math.floor(baseGlucose + Math.cos(Date.now() / 25000) * 12 + Math.random() * 3);
      const neuralCoherence = +(baseBrainwaves + Math.sin(Date.now() / 5000) * 3 + Math.random() * 0.8).toFixed(1);
      const bodyTemp = +(36.6 + Math.sin(Date.now() / 15000) * 0.2 + Math.random() * 0.05).toFixed(2);
      const respiratoryRate = Math.floor(12 + Math.cos(Date.now() / 8000) * 2 + Math.random());

      const activeShares = this.consents.filter(c => c.isSessionTokenActive && c.scope !== "REVOKED");
      const rewardRate = activeShares.reduce((acc, curr) => acc + curr.vtxStakingReward, 0);
      
      this.credential.vtxCredits = +(this.credential.vtxCredits + (rewardRate / 60)).toFixed(4);
      
      const hrDeviation = Math.abs(heartRate - 70) / 70;
      const spo2Diff = (100 - bloodOxygen) * 2;
      const glucDeviation = Math.abs(bloodGlucose - 95) / 95;
      const ncHarmonic = Math.abs(neuralCoherence - 40) / 40;
      const dynamicScore = Math.floor(96 - (hrDeviation * 15 + spo2Diff * 2 + glucDeviation * 10 + ncHarmonic * 5));
      this.credential.healthScore = Math.min(100, Math.max(60, dynamicScore));

      const user = auth.currentUser;
      if (user) {
        try {
          await updateDoc(doc(db, "credentials", user.uid), {
            healthScore: this.credential.healthScore,
            vtxCredits: this.credential.vtxCredits
          });
        } catch (err) {
          // Silent catch on rapid tick updates
        }
      }

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

  async claimAirdropToken(): Promise<SovereignCredential> {
    await this.delay(800);
    this.credential.vtxCredits += 50.0;
    
    this.currentBlockHeight += 1;
    const newTx: BlockTransaction = {
      id: `tx-${Math.floor(Math.random() * 10000)}`,
      blockHeight: this.currentBlockHeight,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actionType: "REWARD_CLAIMS",
      txHash: "0x" + Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      gasTokens: 0.0,
      userId: auth.currentUser?.uid || "mock"
    };
    
    this.transactions.unshift(newTx);

    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, "credentials", user.uid), {
          vtxCredits: this.credential.vtxCredits
        });
        await setDoc(doc(db, "transactions", newTx.id), newTx);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `credentials/${user.uid}`);
      }
    }
    
    return { ...this.credential };
  }
}

export const healthServiceInstance = new HealthNetworkService();
