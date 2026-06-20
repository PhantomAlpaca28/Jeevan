/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";
import { UserRole } from "../pages/Login";
import BackgroundVideo from "../components/BackgroundVideo";
import {
  Activity,
  ShieldCheck,
  Lock,
  Network,
  LogOut,
  FolderLock,
  Cpu,
  Fingerprint,
  FileText,
  LayoutDashboard,
  FileBadge,
  ShieldAlert,
  Pill,
  Sliders,
  History,
  AlertTriangle,
} from "lucide-react";

interface SidebarItem {
  id: string;
  name: string;
  icon: any;
  roles: UserRole[];
}

interface DashboardLayoutProps {
  id?: string;
  userRole: UserRole;
  userDid: string;
  activeTab: string;
  onChangeTab: (tabId: string) => void;
  onLogout: () => void;
  children: ReactNode;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: "vitals",
    name: "Coherence Node",
    icon: Activity,
    roles: ["PATIENT", "DOCTOR", "PHARMACIST", "ADMIN"],
  },
  {
    id: "records",
    name: "Sovereign Records",
    icon: FileText,
    roles: ["PATIENT"],
  },
  {
    id: "doctor-board",
    name: "Clinician Board",
    icon: LayoutDashboard,
    roles: ["DOCTOR"],
  },
  {
    id: "pharmacist-board",
    name: "Pharmacist Px",
    icon: Pill,
    roles: ["PHARMACIST"],
  },
  {
    id: "fraud-detection",
    name: "Fraud Sentinel",
    icon: AlertTriangle,
    roles: ["ADMIN"],
  },
  {
    id: "identity",
    name: "Sovereign Identity",
    icon: Fingerprint,
    roles: ["PATIENT"],
  },
  {
    id: "consent",
    name: "Consent Hub",
    icon: ShieldCheck,
    roles: ["PATIENT"],
  },
  {
    id: "ai-guardian",
    name: "AI Guardian",
    icon: Cpu,
    roles: ["PATIENT"],
  },
  {
    id: "data-will",
    name: "Legacy Data Will",
    icon: FileBadge,
    roles: ["PATIENT"],
  },
  {
    id: "time-machine",
    name: "Health Time Machine",
    icon: Sliders,
    roles: ["PATIENT"],
  },
  {
    id: "audit-timeline",
    name: "Cryptographic Audit",
    icon: History,
    roles: ["PATIENT"],
  },
  {
    id: "emergency-gate",
    name: "Break Glass Access",
    icon: ShieldAlert,
    roles: ["PATIENT", "DOCTOR", "ADMIN", "PHARMACIST"],
  },
  {
    id: "ledger",
    name: "Diagnostic Ledger",
    icon: FolderLock,
    roles: ["PATIENT", "DOCTOR", "PHARMACIST", "ADMIN"],
  },
];

export default function DashboardLayout({
  id,
  userRole,
  userDid,
  activeTab,
  onChangeTab,
  onLogout,
  children,
}: DashboardLayoutProps) {
  return (
    <div id={id || "vortexa-dashboard-layout"} className="min-h-screen bg-slate-950/45 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Video layer */}
      <BackgroundVideo opacity={0.3} />

      {/* Side-by-side Layout on desktop / collapsible stack on mobile */}
      <div className="flex-1 flex flex-col md:flex-row z-10 relative">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neon-cyan/20 bg-slate-950/35 backdrop-blur-2xl flex flex-col p-5 justify-between shrink-0">
          <div className="flex flex-col gap-6">
            {/* Header logo / branding inside sidebar */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neon-cyan to-neon-blue p-[1.5px] shadow-[0_0_12px_rgba(0,240,255,0.2)]">
                <div className="w-full h-full bg-cyber-dark rounded-[7px] flex items-center justify-center">
                  <Network className="w-4 h-4 text-neon-cyan" />
                </div>
              </div>
              <div>
                <h2 className="font-display font-black text-lg tracking-tight text-white leading-none">VORTEXA</h2>
                <span className="text-[7px] font-mono border border-neon-cyan/20 text-neon-cyan rounded px-1 tracking-wider uppercase mt-1 inline-block">
                  {userRole} NODE
                </span>
              </div>
            </div>

            {/* Compact patient telemetry card inside sidebar */}
            <div className="flex flex-col gap-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-900/60 leading-none">
              <span className="font-mono text-[8px] text-slate-500 uppercase tracking-wider">ACTIVEID_DID</span>
              <p className="font-mono text-[9px] text-slate-300 font-semibold truncate leading-none select-all" title={userDid}>
                {userDid}
              </p>
            </div>

            {/* Sidebar nav items link list */}
            <nav className="flex flex-col gap-1">
              <label className="font-mono text-[9px] text-slate-500 tracking-wider mb-2">INTELLIGENCE SUITES</label>
              {SIDEBAR_ITEMS.map((item) => {
                const isPermitted = item.roles.includes(userRole);
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    id={`nav-item-${item.id}`}
                    key={item.id}
                    disabled={!isPermitted}
                    onClick={() => onChangeTab(item.id)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-mono text-xs transition-all w-full text-left relative ${
                      !isPermitted
                        ? "opacity-35 cursor-not-allowed text-slate-600"
                        : isActive
                        ? "bg-neon-cyan/10 text-neon-cyan font-bold border-l-2 border-neon-cyan"
                        : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-neon-cyan" : "text-slate-400"}`} />
                      <span>{item.name}</span>
                    </div>

                    {!isPermitted && (
                      <Lock className="w-3 h-3 text-slate-600 pr-0.5" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar bottom signature / Logout node */}
          <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-slate-900/60">
            {/* Operator/Clinical specialized badges to highlight roles */}
            {userRole !== "PATIENT" && (
              <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-neon-purple/20">
                <Cpu className="w-4 h-4 text-neon-purple shrink-0 animate-pulse" />
                <div className="leading-tight">
                  <p className="font-mono text-[8px] text-slate-500">OPERATOR_OVERRIDE</p>
                  <p className="font-mono text-[9px] text-neon-purple font-semibold">Clinician Access</p>
                </div>
              </div>
            )}

            <button
              id="logout-signer-btn"
              onClick={onLogout}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-mono text-xs text-slate-400 hover:text-white hover:bg-red-950/20 hover:border hover:border-red-900/20 transition-all cursor-pointer w-full text-left"
            >
              <LogOut className="w-4 h-4 text-neon-rose text-opacity-80" />
              <span>TERMINATE_SESSION</span>
            </button>
          </div>
        </aside>

        {/* Dashboard Workspace panel wrapper */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
