import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with Database ID (Crucial per instructions)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Test connection initially
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration or network status.");
    }
  }
}
testConnection();

// Define operational types for Firebase spec compliance
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Global Spec-Compliant Firestore Error Handler
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface UserProfile {
  uid: string;
  email: string;
  role: "PATIENT" | "DOCTOR" | "PHARMACIST" | "ADMIN";
  did: string;
  createdAt: string;
}

// Save initial mock data for newly created user
export async function seedUserDataForId(userId: string, role: string, email: string) {
  const isPatient = role === "PATIENT";
  const label = isPatient ? "Sovereign Patient" : role === "DOCTOR" ? "Dr. Michael Stone" : role === "PHARMACIST" ? "Pharmacist Node" : "Cyber Security Admin";

  // 1. Initial Sovereign Credentials
  try {
    await setDoc(doc(db, "credentials", userId), {
      did: `did:vitaltwin:ipns:${userId.substring(0, 16)}`,
      publicKey: "04:6cf7:1e9a:cdb1:7245:bf8a:29d3:0f91:8e57:9982:1c67:e2a8:440c:5601:9bb4:aa20",
      privateKeyWIF: `vx_prv_key_${userId.substring(0, 16)}8f2a9e31dcdc`,
      signingAlgorithm: "Ed25519",
      authStatus: "VERIFIED",
      healthScore: isPatient ? 88 : 100,
      vtxCredits: isPatient ? 342.50 : 0,
      userId: userId
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `credentials/${userId}`);
  }

  // 2. Initial Records
  try {
    const recordTemplates = [
      {
        id: `rec-gen-${userId.substring(0, 4)}`,
        timestamp: "2026-06-18 14:32:01",
        originNode: "Vital Twin Neural Sequencing Lab Node 4",
        category: "GENOMIC",
        diagnosticSummary: "Epi-genomic micro-metabolism profile synthesized successfully.",
        clinicalNarrative: `DNA methylation analysis reveals high adaptive capacity for ${label} high-density tasks. Elevated markers on chromosome 7 indicate moderate antioxidant resistance; recommendation of lipid replenishment protocols.`,
        severity: "NOMINAL",
        isEncrypted: false,
        integrityHash: "Qm6f5a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c",
        userId: userId
      },
      {
        id: `rec-neuro-${userId.substring(0, 4)}`,
        timestamp: "2026-06-19 09:15:44",
        originNode: "Quantum Neuro-imaging Node 17",
        category: "NEURO-SYNAPTIC",
        diagnosticSummary: "Hyper-coherent gamma-wave burst detected with high neuroplasticity profile.",
        clinicalNarrative: "EEG feedback mapping shows localized gamma burst synchronicity at 40Hz within prefrontal synapsis. Coherence index is exceptional, mirroring deep flow-state trigger conditions. Core keys validated.",
        severity: "NOMINAL",
        isEncrypted: false,
        integrityHash: "Qm8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7",
        userId: userId
      }
    ];

    for (const t of recordTemplates) {
      await setDoc(doc(db, "records", t.id), t);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, "records");
  }

  // 3. Initial Consents
  try {
    const consentTemplates = [
      {
        id: `con-1-${userId.substring(0, 4)}`,
        entityName: "VITAL TWIN Medical Diagnostic Agent V4 (AI)",
        entityType: "AI_DIAGNOSTIC_AGENT",
        scope: "FULL_OMNI_ACCESS",
        expiresAt: "2500-01-01 00:00:00",
        isSessionTokenActive: true,
        vtxStakingReward: 0.05,
        userId: userId
      },
      {
        id: `con-2-${userId.substring(0, 4)}`,
        entityName: "Hale-Glaxo Bio-Research Labs",
        entityType: "RESEARCH_CONSOR_PHARMA",
        scope: "ANONYMIZED_AGGREGATE",
        expiresAt: "2026-12-31 23:59:59",
        isSessionTokenActive: true,
        vtxStakingReward: 0.15,
        userId: userId
      }
    ];

    for (const c of consentTemplates) {
      await setDoc(doc(db, "consents", c.id), c);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, "consents");
  }

  // 4. Initial Transactions
  try {
    const txTemplates = [
      {
        id: `tx-1-${userId.substring(0, 4)}`,
        blockHeight: 641203,
        timestamp: "2026-06-20 06:40:12",
        actionType: "KEY_ROTATION",
        txHash: "0x7a2c9f11a8491eb01ffd3bf90",
        gasTokens: 0.012,
        userId: userId
      },
      {
        id: `tx-2-${userId.substring(0, 4)}`,
        blockHeight: 641198,
        timestamp: "2026-06-20 05:22:45",
        actionType: "CONSENT_GRANT",
        txHash: "0x3bc1e26fa2c1f9e0ab23ddfe98",
        gasTokens: 0.008,
        userId: userId
      }
    ];

    for (const tx of txTemplates) {
      await setDoc(doc(db, "transactions", tx.id), tx);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, "transactions");
  }
}
