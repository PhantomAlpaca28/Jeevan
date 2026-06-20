/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SovereignCredential {
  did: string; // Decentralized Identifier
  publicKey: string;
  privateKeyWIF: string; // Simulated Wallet Import Format key
  signingAlgorithm: "Ed25519" | "Secp256k1" | "RSA-4096";
  authStatus: "VERIFIED" | "PENDING_KEY_ROTATION" | "UNSECURED";
  healthScore: number; // Patient Health Index derived from real-time biometric metrics
  vtxCredits: number; // Sovereign Network Token balance
}

export interface BiometricStream {
  timestamp: string;
  heartRate: number;
  bloodOxygen: number;
  bloodGlucose: number;
  neuralCoherence: number; // in Hz (Alpha/Beta/Gamma brainwave activity)
  bodyTemp: number;
  respiratoryRate: number;
}

export interface MedicalDiagnosticRecord {
  id: string;
  timestamp: string;
  originNode: string; // e.g., 'Mayo-Quantum Diagnostic Node 12'
  category: "GENOMIC" | "CARDIOVASCULAR" | "NEURO-SYNAPTIC" | "METABOLIC" | "CHRONIC";
  diagnosticSummary: string;
  clinicalNarrative: string;
  severity: "CRITICAL" | "ELEVATED" | "NOMINAL";
  isEncrypted: boolean;
  decryptionKeyId?: string;
  integrityHash: string; // SHA-256 IPFS hash mock
  userId?: string;
}

export interface ConsentPermission {
  id: string;
  entityName: string;
  entityType: "AI_DIAGNOSTIC_AGENT" | "RESEARCH_CONSOR_PHARMA" | "PRIMARY_CARE_HOSPITAL" | "INSURANCE_NODE";
  scope: "FULL_OMNI_ACCESS" | "ANONYMIZED_AGGREGATE" | "NEURAL_ONLY" | "REVOKED";
  expiresAt: string;
  isSessionTokenActive: boolean;
  vtxStakingReward: number; // credits rewarded to user per min. of sharing
  userId?: string;
}

export interface BlockTransaction {
  id: string;
  blockHeight: number;
  timestamp: string;
  actionType: "KEY_ROTATION" | "CONSENT_GRANT" | "CONSENT_REVOKE" | "DATA_ENCRYPT" | "REWARD_CLAIMS";
  txHash: string;
  gasTokens: number;
  userId?: string;
}
