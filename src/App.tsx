/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./services/firebase";
import SovereignNode3D from "./components/SovereignNode3D";
import SovereignVault from "./components/SovereignVault";
import BiometricsHub from "./components/BiometricsHub";
import PharmacistCoherence from "./components/PharmacistCoherence";
import AdminCoherence from "./components/AdminCoherence";
import SovereignIdentity from "./components/SovereignIdentity";
import ConsentManager from "./components/ConsentManager";
import DiagnosticLedger from "./components/DiagnosticLedger";
import MedicalRecords from "./pages/patient/MedicalRecords";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PharmacistDashboard from "./pages/pharmacist/PharmacistDashboard";
import FraudDetection from "./pages/admin/FraudDetection";
import AuditTimeline from "./pages/patient/AuditTimeline";
import HealthDataTimeMachine from "./pages/patient/HealthDataTimeMachine";
import AIGuardian from "./pages/patient/AIGuardian";
import HealthcareDataWill from "./pages/patient/HealthcareDataWill";
import EmergencyBreakGlass from "./pages/patient/EmergencyBreakGlass";
import Login, { UserRole } from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import { healthServiceInstance } from "./services/healthNetworkService";

import {
  SovereignCredential,
  BiometricStream,
  MedicalDiagnosticRecord,
  ConsentPermission,
  BlockTransaction
} from "./types";

import { Network, RefreshCw } from "lucide-react";

export default function App() {
  // Session Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("PATIENT");
  const [userDid, setUserDid] = useState("");
  const [activeTab, setActiveTab] = useState("vitals");
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  // Core Data state
  const [credentials, setCredentials] = useState<SovereignCredential | null>(null);
  const [records, setRecords] = useState<MedicalDiagnosticRecord[]>([]);
  const [consents, setConsents] = useState<ConsentPermission[]>([]);
  const [transactions, setTransactions] = useState<BlockTransaction[]>([]);
  const [liveVitals, setLiveVitals] = useState<BiometricStream>({
    timestamp: "03:00:00",
    heartRate: 72,
    bloodOxygen: 98,
    bloodGlucose: 95,
    neuralCoherence: 40.0,
    bodyTemp: 36.6,
    respiratoryRate: 14
  });

  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"CONNECTED" | "SYNCING" | "OFFLINE">("CONNECTED");

  // 1. Session listener to automatically restore login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const profile = userDoc.data();
            setUserRole(profile.role || "PATIENT");
            setUserDid(profile.did || `did:vitaltwin:ipns:${user.uid.substring(0, 16)}`);
          } else {
            setUserRole("PATIENT");
            setUserDid(`did:vitaltwin:ipns:${user.uid.substring(0, 16)}`);
          }
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Auth session restore failure", err);
        }
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Load user-specific dataset upon successful sign-in
  useEffect(() => {
    if (!isLoggedIn) return;

    async function loadUserData() {
      try {
        setSyncStatus("SYNCING");
        const cred = await healthServiceInstance.getCredentials();
        const logs = await healthServiceInstance.getDiagnosticLogs();
        const cnc = await healthServiceInstance.getConsents();
        const txs = await healthServiceInstance.getTransactions();

        setCredentials(cred);
        setRecords(logs);
        setConsents(cnc);
        setTransactions(txs);
        setSyncStatus("CONNECTED");
      } catch (err) {
        console.error("Firestore user data sync failure", err);
        setSyncStatus("OFFLINE");
      }
    }

    loadUserData();

    // Start live biometrics dynamic dashboard updates
    healthServiceInstance.startLiveBiometrics((stream, healthScore, vtxCredits) => {
      setLiveVitals(stream);
      setCredentials((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          healthScore,
          vtxCredits
        };
      });
    });

    return () => {
      healthServiceInstance.stopLiveBiometrics();
    };
  }, [isLoggedIn]);

  // Sync / refresh manually
  const refreshLedger = async () => {
    setSyncStatus("SYNCING");
    const logs = await healthServiceInstance.getDiagnosticLogs();
    const txs = await healthServiceInstance.getTransactions();
    setRecords(logs);
    setTransactions(txs);
    setTimeout(() => {
      setSyncStatus("CONNECTED");
    }, 700);
  };

  // Sovereign actions
  const handleRotateKeys = async () => {
    const updatedCred = await healthServiceInstance.rotateSovereignKeys();
    setCredentials(updatedCred);
    const txs = await healthServiceInstance.getTransactions();
    setTransactions(txs);
  };

  const handleClaimTokens = async () => {
    const updatedCred = await healthServiceInstance.claimAirdropToken();
    setCredentials(updatedCred);
    const txs = await healthServiceInstance.getTransactions();
    setTransactions(txs);
  };

  const handleEncryptRecord = async (id: string) => {
    await healthServiceInstance.encryptDiagnosticLog(id);
    const logs = await healthServiceInstance.getDiagnosticLogs();
    setRecords(logs);
    const txs = await healthServiceInstance.getTransactions();
    setTransactions(txs);
    return true;
  };

  const handleDecryptRecord = async (id: string) => {
    await healthServiceInstance.decryptDiagnosticLog(id);
    const logs = await healthServiceInstance.getDiagnosticLogs();
    setRecords(logs);
    return true;
  };

  const handleUpdateConsent = async (id: string, newScope: ConsentPermission["scope"]) => {
    const cnc = await healthServiceInstance.updateConsentScope(id, newScope);
    setConsents(cnc);
    const txs = await healthServiceInstance.getTransactions();
    setTransactions(txs);
  };

  const handleLogin = (role: UserRole, did: string) => {
    setUserRole(role);
    setUserDid(did);
    setIsLoggedIn(true);
    
    // Set appropriate default suite tab based on permission access
    if (role === "PHARMACIST") {
      setActiveTab("pharmacist-board");
    } else if (role === "ADMIN") {
      setActiveTab("fraud-detection");
    } else if (role === "DOCTOR") {
      setActiveTab("doctor-board");
    } else {
      setActiveTab("vitals");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out failure", err);
    }
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen cyber-gradient flex flex-col items-center justify-center font-mono">
        <div className="absolute inset-0 cyber-dot-grid opacity-20 pointer-events-none" />
        <div className="relative flex flex-col items-center gap-6 p-10 glass-panel-heavy rounded-2xl max-w-sm text-center border-neon-cyan/20">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 w-full h-full rounded-full border-4 border-neon-cyan/10" />
            <div className="absolute inset-0 w-full h-full rounded-full border-4 border-t-neon-cyan animate-spin" />
            <Network className="absolute inset-0 m-auto w-6 h-6 text-neon-cyan animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl tracking-widest text-white leading-tight">VITAL TWIN SECURE</h2>
            <p className="text-[10px] text-neon-cyan font-bold tracking-widest mt-1">ESTABLISHING INTEGRITY_NODE</p>
          </div>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Authenticating local sovereign keys. Syncing peer diagnostic nodes over IPNS ledger networks...
          </p>
        </div>
      </div>
    );
  }

  // Render Login page if not authorized session
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout
      userRole={userRole}
      userDid={userDid}
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      onLogout={handleLogout}
    >
      {/* Background Holographic Scanline Overlay effects */}
      <div className="absolute inset-0 scanlines pointer-events-none z-40 opacity-20" />
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      {/* Primary Workspace Tab Switchers based on active nav selection */}
      <div className="flex flex-col gap-6">
        {/* Dynamic Workspace Utilities Header with Quick Ledger sync */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-900/40 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[9.5px] uppercase tracking-wider text-slate-400 font-bold">
              {activeTab === "vitals" && "Sovereign Dashboard Node"}
              {activeTab === "records" && "Sovereign records Node"}
              {activeTab === "doctor-board" && "Clinician Node"}
              {activeTab === "pharmacist-board" && "Pharmacist Prescriptions Node"}
              {activeTab === "fraud-detection" && "Cyber Security Fraud Node"}
              {activeTab === "ai-guardian" && "Sovereign AI Node"}
              {activeTab === "ledger" && "Decentralized Ledger Node"}
              {activeTab === "consent" && "Consent Ledger Node"}
              {activeTab === "emergency-gate" && "Emergency Access Overrides"}
              {activeTab === "time-machine" && "Temporal Intelligence Node"}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#05111d] px-3 py-1.5 rounded-lg border border-slate-900 leading-none">
            <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'CONNECTED' ? 'bg-emerald-400' : 'bg-emerald-400 animate-spin'}`} />
            <span className="text-[8.5px] font-mono text-slate-400 tracking-wider font-bold">SYNC: {syncStatus}</span>
            <button
              id="dash-sync-btn"
              onClick={refreshLedger}
              className="p-0.5 hover:bg-slate-900 rounded text-slate-500 hover:text-white transition-all ml-1"
            >
              <RefreshCw className={`w-3 h-3 ${syncStatus === 'SYNCING' ? 'animate-spin text-emerald-400' : ""}`} />
            </button>
          </div>
        </div>

        {/* Dynamic Module Rendering based on Tab State / Role Protection */}
        <div className="grid grid-cols-1 gap-6">
          {/* Node Coherence Vitals Tab - Role Protected Modules */}
          {activeTab === "vitals" && (
            <>
              {(userRole === "PATIENT" || userRole === "DOCTOR") && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7 flex flex-col gap-6">
                    <SovereignNode3D
                      neuralHz={liveVitals.neuralCoherence}
                      heartRate={liveVitals.heartRate}
                    />
                    <SovereignVault />
                  </div>
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    <BiometricsHub
                      currentVitals={liveVitals}
                      healthScore={credentials ? credentials.healthScore : 88}
                    />
                  </div>
                </div>
              )}
              {userRole === "PHARMACIST" && <PharmacistCoherence />}
              {userRole === "ADMIN" && <AdminCoherence />}
            </>
          )}

          {/* Sovereign Identity Tab - Role Protected: PATIENT */}
          {activeTab === "records" && userRole === "PATIENT" && (
            <MedicalRecords />
          )}

          {/* Clinician Board Dashboard Tab - Role Protected: DOCTOR */}
          {activeTab === "doctor-board" && userRole === "DOCTOR" && (
            <DoctorDashboard />
          )}

          {activeTab === "identity" && userRole === "PATIENT" && credentials && (
            <div className="max-w-3xl">
              <SovereignIdentity
                credentials={credentials}
                transactions={transactions}
                onRotateKeys={handleRotateKeys}
                onClaimTokens={handleClaimTokens}
              />
            </div>
          )}

          {/* Consent Hub Tab - Role Protected: PATIENT */}
          {activeTab === "consent" && userRole === "PATIENT" && (
            <div className="max-w-4xl">
              <ConsentManager
                consents={consents}
                onUpdateConsent={handleUpdateConsent}
              />
            </div>
          )}

          {/* AI Guardian Predictive Intelligence Tab - Role Protected: PATIENT */}
          {activeTab === "ai-guardian" && userRole === "PATIENT" && (
            <AIGuardian />
          )}

          {/* Post-Mortem Healthcare Legacy Will Tab - Role Protected: PATIENT */}
          {activeTab === "data-will" && userRole === "PATIENT" && (
            <HealthcareDataWill />
          )}

          {/* Health Data Temporal Scrubbing Slider Tab - Role Protected: PATIENT */}
          {activeTab === "time-machine" && userRole === "PATIENT" && (
            <HealthDataTimeMachine />
          )}

          {/* Cryptographic Sovereign Audit Timeline Tab - Role Protected: PATIENT */}
          {activeTab === "audit-timeline" && userRole === "PATIENT" && (
            <AuditTimeline />
          )}

          {/* Pharmacist Workflow Dashboard Tab - Role Protected: PHARMACIST */}
          {activeTab === "pharmacist-board" && userRole === "PHARMACIST" && (
            <PharmacistDashboard />
          )}

          {/* Cybersecurity Admin Fraud Prevention Dashboard Tab - Role Protected: ADMIN */}
          {activeTab === "fraud-detection" && userRole === "ADMIN" && (
            <FraudDetection />
          )}

          {/* Emergency Break Glass Bypass Tab - Role Protected: ALL */}
          {activeTab === "emergency-gate" && (
            <EmergencyBreakGlass
              isEmergencyActive={isEmergencyActive}
              onToggleEmergency={setIsEmergencyActive}
            />
          )}

          {/* Diagnostic Records Ledger Tab - Role Protected: ALL */}
          {activeTab === "ledger" && (
            <DiagnosticLedger
              records={records}
              onEncrypt={handleEncryptRecord}
              onDecrypt={handleDecryptRecord}
            />
          )}
        </div>
      </div>

      {/* Extreme flashing alarm backdrop context indicator when break-glass overrides exist */}
      {isEmergencyActive && (
        <div className="fixed inset-0 pointer-events-none border-[6px] border-red-500/80 animate-pulse z-50 shadow-[inset_0_0_50px_rgba(239,68,68,0.4)]" />
      )}
    </DashboardLayout>
  );
}
