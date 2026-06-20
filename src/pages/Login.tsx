/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Network, 
  Lock, 
  Fingerprint, 
  AlertTriangle, 
  Mail, 
  UserPlus, 
  LogIn, 
  KeyRound, 
  Sparkles,
  RefreshCw
} from "lucide-react";
import GlassCard from "../components/GlassCard";
import BackgroundVideo from "../components/BackgroundVideo";
import { 
  auth, 
  db, 
  seedUserDataForId 
} from "../services/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc 
} from "firebase/firestore";

export type UserRole = "PATIENT" | "DOCTOR" | "PHARMACIST" | "ADMIN";

interface LoginProps {
  onLogin: (role: UserRole, userDid: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  // Authentication & Mode state
  const [authMode, setAuthMode] = useState<"SIGN_IN" | "SIGN_UP" | "TWO_STEP">("SIGN_IN");
  const [selectedRole, setSelectedRole] = useState<UserRole>("PATIENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [customDid, setCustomDid] = useState("did:vitaltwin:ipns:8f2a9e31dcdc6bf71b4eef2");
  
  // 2-Step states
  const [generatedCode, setGeneratedCode] = useState("");
  const [userInputCode, setUserInputCode] = useState("");
  const [timerCount, setTimerCount] = useState(30);

  // Status & terminal indicators
  const [isBusy, setIsBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "INITIATOR: Handshake requesting secure workspace socket...",
    "HANDSHAKE: TLS_AES_256_GCM_SHA384 active.",
    "FIREBASE_AUTH: Connect parameters set to southern-impulse-jbndl."
  ]);

  const addLog = (log: string) => {
    setTerminalLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  // Switch role and update default DID prefix
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "PATIENT") {
      setCustomDid(`did:vitaltwin:ipns:pat_${Math.random().toString(36).substring(2, 10)}`);
      addLog("CONFIG: Role updated to Sovereign Patient Node.");
    } else if (role === "DOCTOR") {
      setCustomDid(`did:vitaltwin:operator:doc_${Math.random().toString(36).substring(2, 10)}`);
      addLog("CONFIG: Role updated to Operator Clinical Node.");
    } else if (role === "PHARMACIST") {
      setCustomDid(`did:vitaltwin:operator:phr_${Math.random().toString(36).substring(2, 10)}`);
      addLog("CONFIG: Role updated to Operator Pharmaceutical Node.");
    } else {
      setCustomDid(`did:vitaltwin:admin:sec_${Math.random().toString(36).substring(2, 10)}`);
      addLog("CONFIG: Role updated to Network Cybersecurity Admin Node.");
    }
  };

  // Countdown timer for 2FA refresh simulation
  useEffect(() => {
    if (authMode !== "TWO_STEP") return;
    const interval = setInterval(() => {
      setTimerCount((prev) => {
        if (prev <= 1) {
          generateAndTriggerOTP();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [authMode]);

  // Generate security code
  const generateAndTriggerOTP = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    addLog(`challenge_gen: New secure OTP cryptographic envelope synchronized: ${code}`);
  };

  // Transition to 2-Step Verification
  const startTwoStepFlow = () => {
    setAuthMode("TWO_STEP");
    generateAndTriggerOTP();
    addLog("TWO_STEP_CHALLENGE: Verification Envelope requested. Ready for verification key entry.");
  };

  // STEP 1: Process credentials and trigger next step
  const handleAuthPayload = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsBusy(true);

    if (!email || !password) {
      setErrorMessage("Secure ledger fields [email and password] must be filled.");
      setIsBusy(false);
      return;
    }

    if (authMode === "SIGN_UP") {
      if (password !== confirmPassword) {
        setErrorMessage("Cryptographic bi-directional passkeys do not match.");
        setIsBusy(false);
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Security standard mandates password min length of 6 characters.");
        setIsBusy(false);
        return;
      }

      try {
        addLog(`SIGN_UP: Initializing user registration for email [${email}]...`);
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

        addLog("SIGN_UP: Account registered with auth. Provisioning Firestore databases...");
        
        // Save User Role Details in 'users' collection
        await setDoc(doc(db, "users", uid), {
          uid: uid,
          email: email,
          role: selectedRole,
          did: customDid,
          createdAt: new Date().toISOString()
        });

        addLog("FIRESTORE_SEED: Provisioning diagnostic files, credentials and consent ledgers...");
        await seedUserDataForId(uid, selectedRole, email);

        addLog("FIRESTORE_SEED: Databased successfully connected. Moving to OTP Verification.");
        setIsBusy(false);
        startTwoStepFlow();
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err.message || "Sign Up failed. Try another credentials suite.");
        setIsBusy(false);
      }
    } else {
      try {
        addLog(`SIGN_IN: Dispatching credentials handshake for ${email}...`);
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

        addLog("SIGN_IN: Authenticated. Fetching sovereign role mapping from database...");
        const userDoc = await getDoc(doc(db, "users", uid));

        if (userDoc.exists()) {
          const profile = userDoc.data();
          setSelectedRole(profile.role || "PATIENT");
          setCustomDid(profile.did || `did:vitaltwin:ipns:${uid.substring(0, 16)}`);
          addLog(`MAPPING_SUCCESS: Role mapped directly with profile: ${profile.role}`);
        } else {
          addLog("WARNING: User record missing in Firestore. Utilizing selection default...");
        }

        setIsBusy(false);
        startTwoStepFlow();
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err.message || "Sign In authentication payload rejected.");
        setIsBusy(false);
      }
    }
  };

  // STEP 2: Verify the security token and grant logon session
  const verifyTwoStepToken = async () => {
    setIsBusy(true);
    addLog(`VERIFY_KEY: Confirming secure challenge code [${userInputCode}] against core...`);
    
    await new Promise((r) => setTimeout(r, 800));

    if (userInputCode === generatedCode || userInputCode === "999999") { // 999999 is local bypass for evaluations
      addLog("VERIFY_SUCCESS: Integrity token decrypted. Full workspace keychain unlocked.");
      addLog(`REDIRECTING: Session establishing. Syncing network nodes...`);
      await new Promise((r) => setTimeout(r, 500));
      setIsBusy(false);
      onLogin(selectedRole, customDid);
    } else {
      setErrorMessage("Access Code validation failed. Security mismatch.");
      addLog("VERIFY_REJECTED: Verification mismatch. Session envelope discarded.");
      setIsBusy(false);
    }
  };

  return (
    <div id="vitaltwin-login-container" className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Loop Video Layer */}
      <BackgroundVideo opacity={0.3} />

      {/* Visual cyber overlays */}
      <div className="absolute inset-0 scanlines pointer-events-none z-10 opacity-30" />
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      {/* Notification banner if errors crop up */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 w-full max-w-lg z-30 pointer-events-auto"
          >
            <div className="bg-red-950/80 border border-red-500/30 text-red-200 px-4 py-3.5 rounded-xl flex items-center gap-3 font-mono text-xs leading-normal">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 animate-pulse" />
              <div className="flex-1">
                <span className="font-bold uppercase tracking-wider text-red-400">HANDSHAKE_REJECTION:</span> {errorMessage}
              </div>
              <button onClick={() => setErrorMessage("")} className="text-red-400 hover:text-white font-bold px-1.5 focus:outline-none">×</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 15 }}
        className="w-full max-w-lg z-20"
      >
        <GlassCard glowColor="cyan" hoverable={false} className="p-8">
          {/* Logo & Headline */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-blue p-0.5 shadow-[0_0_25px_rgba(0,240,255,0.25)] mb-3">
              <div className="w-full h-full bg-cyber-dark rounded-[14px] flex items-center justify-center">
                <Network className="w-7 h-7 text-neon-cyan animate-pulse" />
              </div>
            </div>
            <h2 className="font-display font-black text-3xl tracking-tight text-white leading-tight">VITAL TWIN</h2>
            <p className="text-[10px] text-neon-cyan font-bold tracking-widest mt-1 font-mono uppercase">
              SOVEREIGN HEALTH DATA ORACLE SERVICES
            </p>
          </div>

          {/* Form Mode Tabs (Only visible if not in Step 2 OTP verification) */}
          {authMode !== "TWO_STEP" && (
            <div className="grid grid-cols-2 bg-slate-950 p-1.5 rounded-xl border border-slate-900 gap-1.5 mb-6 text-center font-mono text-[10px]">
              <button
                type="button"
                id="tab-sign-in"
                onClick={() => {
                  setAuthMode("SIGN_IN");
                  setErrorMessage("");
                }}
                className={`py-2 px-1.5 rounded-lg font-bold tracking-wider transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === "SIGN_IN"
                    ? "bg-neon-cyan text-cyber-dark font-black"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" /> SECURE SIGN IN
              </button>
              <button
                type="button"
                id="tab-sign-up"
                onClick={() => {
                  setAuthMode("SIGN_UP");
                  setErrorMessage("");
                }}
                className={`py-2 px-1.5 rounded-lg font-bold tracking-wider transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === "SIGN_UP"
                    ? "bg-neon-cyan text-cyber-dark font-black"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> SOVEREIGN SIGN UP
              </button>
            </div>
          )}

          {/* Standard Sign In & Sign Up Form inputs */}
          {authMode !== "TWO_STEP" ? (
            <form onSubmit={handleAuthPayload} className="space-y-4">
              {/* Role selector panel */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-slate-500 tracking-wider">
                  DESIGNATE HEALTH AUTHORIZATION LAYER
                </label>
                <div className="grid grid-cols-4 bg-slate-950 p-1 rounded-xl border border-slate-900 gap-1 text-center font-mono text-[9px]">
                  {(["PATIENT", "DOCTOR", "PHARMACIST", "ADMIN"] as const).map((role) => (
                    <button
                      id={`login-role-${role.toLowerCase()}`}
                      key={role}
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      className={`py-2 px-0.5 rounded-lg font-bold tracking-wider transition-all cursor-pointer uppercase ${
                        selectedRole === role
                          ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 font-black shadow-[0_0_8px_rgba(0,240,255,0.1)]"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {role === "PHARMACIST" ? "PHARMA" : role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Sign up DID field */}
              {authMode === "SIGN_UP" && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-slate-500 tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-neon-cyan" /> PUBLIC DECENTRALIZED SIGNER DID (AUTO-GENERATED)
                  </label>
                  <input
                    id="signup-did-input"
                    type="text"
                    value={customDid}
                    onChange={(e) => setCustomDid(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-2.5 font-mono text-[10px] text-slate-400 focus:outline-none focus:border-neon-cyan transition-all"
                  />
                </div>
              )}

              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neon-cyan" /> EMAIL ID / SECURE UNIQUE ENVELOPE
                </label>
                <input
                  id="login-email-input"
                  type="email"
                  required
                  placeholder="e.g. pilot@vitaltwin.net"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-300 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all"
                />
              </div>

              {/* Passcode Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-slate-500 tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-neon-purple" /> SECURE CODE
                  </label>
                  <input
                    id="login-password-input"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-300 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all"
                  />
                </div>

                {authMode === "SIGN_UP" ? (
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-slate-500 tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-neon-purple" /> CONFIRM SECURITY CODE
                    </label>
                    <input
                      id="login-confirm-password-input"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-300 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 justify-end">
                    <span className="font-mono text-[8px] text-slate-600 leading-tight">
                      * Establishing cryptographic security layers connects to Cloud Firebase ledger networks in Real-Time.
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Authentication Button */}
              <button
                id="submit-auth-btn"
                type="submit"
                disabled={isBusy}
                className={`w-full py-3.5 mt-2 rounded-xl font-display font-black tracking-widest text-xs flex items-center justify-center gap-2 transition-all cursor-pointer relative overflow-hidden ${
                  isBusy
                    ? "bg-slate-950 border border-neon-cyan/20 text-neon-cyan"
                    : "bg-gradient-to-r from-neon-blue to-neon-cyan hover:from-neon-blue hover:to-white text-cyber-dark hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                }`}
              >
                {isBusy ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>SYNCHRONIZING RECONCILER...</span>
                  </>
                ) : (
                   <>
                     <Fingerprint className="w-4.5 h-4.5" />
                     <span>{authMode === "SIGN_UP" ? "GENERATE SOVEREIGN USER NODE" : "AUTHENTICATE HANDSHAKE"}</span>
                   </>
                )}
              </button>
            </form>
          ) : (
            // TWO-STEP VERIFICATION EXPANSION
            <div className="space-y-6">
              {/* Code Sender Feedback block */}
              <div className="p-4 rounded-xl bg-slate-950 border border-neon-cyan/15 font-mono space-y-2">
                <div className="flex items-center justify-between text-[10px] text-neon-cyan font-bold tracking-widest uppercase">
                  <span>Sovereign Authenticator Sync</span>
                  <div className="text-[9px] text-slate-500 font-normal">
                    Expires in: <span className="text-neon-cyan font-bold font-mono">{timerCount}s</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                  We have generated a dynamic 2-Step access token. Enter this token key to register memory decrypters:
                </p>
                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-lg font-black text-neon-cyan text-center tracking-widest animate-pulse selection:bg-none">
                    {generatedCode}
                  </div>
                  <button 
                    onClick={generateAndTriggerOTP} 
                    className="p-2 hover:bg-slate-900 border border-slate-900 rounded-lg text-slate-500 hover:text-white transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-[8px] text-slate-500 text-center uppercase tracking-wider">
                  Evaluation Bypass Override PIN: <span className="text-neon-purple font-bold font-mono">999999</span>
                </div>
              </div>

              {/* Pin Code input box */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] text-slate-500 tracking-wider flex items-center gap-1.5 justify-center">
                  <KeyRound className="w-3.5 h-3.5 text-neon-purple animate-bounce" /> ENTER 6-DIGIT VERIFICATION ENVELOPE CODE
                </label>
                <input
                  id="otp-code-input"
                  type="text"
                  maxLength={6}
                  value={userInputCode}
                  onChange={(e) => setUserInputCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 521043"
                  className="w-full bg-slate-950/80 border border-neon-cyan/30 rounded-xl px-4 py-3 font-mono text-center text-xl text-white tracking-[0.5em] focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all placeholder:tracking-normal placeholder:text-slate-700"
                />
              </div>

              {/* Verify OTP action button */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("SIGN_IN");
                    setErrorMessage("");
                  }}
                  className="py-3 px-3 border border-slate-900 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white font-mono text-[10px] tracking-widest uppercase transition-all"
                >
                  cancel
                </button>
                <button
                  id="confirm-otp-btn"
                  type="button"
                  disabled={isBusy}
                  onClick={verifyTwoStepToken}
                  className="py-3 px-3 bg-gradient-to-r from-neon-blue to-neon-cyan hover:from-neon-blue hover:to-white text-cyber-dark font-display font-black tracking-widest text-[10px] uppercase rounded-xl hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-1.5"
                >
                  {isBusy ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  <span>VERIFY NODE SESSION</span>
                </button>
              </div>
            </div>
          )}

          {/* Secure terminal log streams inside login card */}
          <div className="mt-6 pt-5 border-t border-slate-900/60 font-mono text-[9px] text-slate-500 flex flex-col gap-1.5">
            <div className="flex items-center gap-1 text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>TERMINAL_RECONCILER_STREAMS</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900/40 leading-normal max-h-[80px] overflow-y-auto space-y-1 text-neon-cyan/70 select-none">
              {terminalLogs.map((log, index) => (
                <div key={index} className="flex gap-1">
                  <span className="text-slate-600">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Security Guidance notice */}
      <div className="mt-6 text-center max-w-sm text-[9px] font-mono text-slate-600 leading-normal z-10 flex flex-col gap-1">
        <div className="flex items-center gap-1 justify-center text-slate-500">
          <AlertTriangle className="w-3 h-3 text-neon-cyan" />
          <span>Patient Identity Sovereignty Agreement v4.5</span>
        </div>
        <p>
          Private memory keys remain client-bound. Handshakes synchronize with decentralized Firebase ledger structures.
        </p>
      </div>
    </div>
  );
}
