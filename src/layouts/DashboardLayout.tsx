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
  Bell,
  Heart,
  ChevronRight,
  Shield,
  Wifi,
  Database
} from "lucide-react";

// Import the generated premium 3D assets to render real assets in the dashboard
// @ts-ignore
import avatarImg from "../assets/images/alex_williams_avatar_1781988081619.jpg";
// @ts-ignore
import shieldImg from "../assets/images/3d_shield_security_icon_1781988041000.jpg";

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
    name: "Dashboard",
    icon: LayoutDashboard,
    roles: ["PATIENT", "DOCTOR", "PHARMACIST", "ADMIN"],
  },
  {
    id: "records",
    name: "Health Records",
    icon: FileText,
    roles: ["PATIENT"],
  },
  {
    id: "doctor-board",
    name: "Clinician Board",
    icon: Sliders,
    roles: ["DOCTOR"],
  },
  {
    id: "pharmacist-board",
    name: "Prescriptions",
    icon: Pill,
    roles: ["PHARMACIST"],
  },
  {
    id: "fraud-detection",
    name: "Fraud Detection",
    icon: AlertTriangle,
    roles: ["ADMIN"],
  },
  {
    id: "ai-guardian",
    name: "AI Safety Analysis",
    icon: ShieldCheck,
    roles: ["PATIENT"],
  },
  {
    id: "ledger",
    name: "Blockchain Ledger",
    icon: FolderLock,
    roles: ["PATIENT", "DOCTOR", "PHARMACIST", "ADMIN"],
  },
  {
    id: "consent",
    name: "Consent Management",
    icon: ShieldCheck,
    roles: ["PATIENT"],
  },
  {
    id: "emergency-gate",
    name: "Care Network",
    icon: ShieldAlert,
    roles: ["PATIENT", "DOCTOR", "ADMIN", "PHARMACIST"],
  },
  {
    id: "time-machine",
    name: "Reports & Insights",
    icon: Sliders,
    roles: ["PATIENT"],
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
  // Get identity details based on the logged role
  const getIdentityDetails = () => {
    switch (userRole) {
      case "DOCTOR":
        return {
          name: "Dr. Marcus Vance",
          sub: "Chief Clinical Officer",
          id: "CLN-4021",
        };
      case "PHARMACIST":
        return {
          name: "Sarah Jenkins, PharmD",
          sub: "Lead Pharmacist",
          id: "PHM-7702",
        };
      case "ADMIN":
        return {
          name: "Admin Controller",
          sub: "Decentralized Key Custodian",
          id: "SEC-1001",
        };
      default:
        return {
          name: "Alex Williams",
          sub: "Patient / Sovereign Owner",
          id: "VTW-9004",
        };
    }
  };

  const identity = getIdentityDetails();

  return (
    <div id={id || "vitaltwin-dashboard-layout"} className="min-h-screen bg-[#03080f] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Ambient Layers */}
      <BackgroundVideo opacity={0.15} />

      {/* Side-by-side Layout on desktop / collapsible stack on mobile */}
      <div className="flex-1 flex flex-col md:flex-row z-10 relative">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-[265px] border-b md:border-b-0 md:border-r border-emerald-950/35 bg-[#040c16]/90 backdrop-blur-3xl flex flex-col p-5 justify-between shrink-0">
          <div className="flex flex-col gap-6">
            {/* Header logo / branding inside sidebar matches VITALTWIN mockup */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1.5px] shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <div className="w-full h-full bg-[#040c16] rounded-[10px] flex items-center justify-center">
                  <Heart className="w-4.5 h-4.5 text-emerald-400" />
                </div>
              </div>
              <div className="leading-tight">
                <h2 className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                  VITALTWIN
                </h2>
                <span className="text-[6.5px] font-mono text-emerald-500 tracking-wider block font-bold mt-0.5 leading-none">
                  PATIENT-SOVEREIGN HEALTHCARE INTELLIGENCE NETWORK
                </span>
              </div>
            </div>

            {/* Compact patient telemetry card inside sidebar */}
            <div className="flex flex-col gap-1.5 bg-[#05111d] p-3 rounded-xl border border-slate-900/60 leading-none">
              <span className="font-mono text-[8px] text-slate-500 uppercase tracking-wider">ACTIVEID_DID</span>
              <p className="font-mono text-[9px] text-slate-300 font-semibold truncate leading-none select-all" title={userDid}>
                {userDid}
              </p>
            </div>

            {/* Sidebar nav items link list */}
            <nav className="flex flex-col gap-1.5">
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
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-sans text-xs transition-all w-full text-left relative ${
                      !isPermitted
                        ? "opacity-30 cursor-not-allowed text-slate-600 hidden"
                        : isActive
                        ? "bg-emerald-950/40 text-emerald-400 font-bold border-l-2 border-emerald-400 shadow-[inset_0_1px_1px_rgba(16,185,129,0.05)]"
                        : "text-slate-400 hover:text-white hover:bg-[#05111d]/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                      <span className="tracking-wide text-[12.5px]">{item.name}</span>
                    </div>

                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Dedicated "YOU OWN YOUR HEALTH DATA" custom banner (matching the sexy mockup) */}
          <div className="flex flex-col gap-4 mt-6">
            <div className="bg-gradient-to-b from-[#061524] to-[#040e18] rounded-xl p-4 border border-emerald-950/30 text-center relative overflow-hidden">
              <div className="flex justify-center mb-3">
                <div className="relative w-14 h-14 rounded-full flex items-center justify-center bg-emerald-950/10">
                  <img
                    src={shieldImg}
                    alt="Privacy Guardian"
                    className="w-12 h-12 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <h4 className="font-display font-bold text-[11px] text-white tracking-wider uppercase mb-1 leading-none">
                YOU OWN YOUR HEALTH DATA
              </h4>
              <p className="text-[9.5px] text-slate-400 leading-normal mb-3">
                You control who can access your information.
              </p>
              <button
                onClick={() => onChangeTab("consent")}
                className="w-full py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-sans text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Manage Access
              </button>
            </div>

            <div className="pt-4 border-t border-slate-900/40">
              <button
                id="logout-signer-btn"
                onClick={onLogout}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-mono text-xs text-slate-400 hover:text-white hover:bg-red-950/20 hover:border hover:border-red-900/10 transition-all cursor-pointer w-full text-left"
              >
                <LogOut className="w-4 h-4 text-neon-rose text-opacity-80" />
                <span>TERMINATE_SESSION</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Dashboard Workspace panel wrapper with mockup-style header */}
        <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
          {/* Mockup Premium welcome header & statuses widgets */}
          <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-slate-900 pb-6 shrink-0">
            <div>
              <div className="flex items-center gap-2 md:gap-2.5">
                <h1 className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-2">
                  Welcome back, {identity.name}
                  <span className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center p-0.5 text-[10px] font-bold border border-emerald-500/20">✓</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 tracking-wide mt-1">
                Your health. Your data. Your future.
              </p>
            </div>

            {/* Quick Status Badges Block */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 bg-[#05111d] border border-slate-900/80 px-4 py-2.5 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-400/20 flex items-center justify-center">
                  <Database className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="leading-tight">
                  <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none">BLOCKCHAIN STATUS</span>
                  <strong className="text-[10px] text-emerald-400 font-bold block mt-1 uppercase">100% SECURE</strong>
                  <span className="text-[8px] text-slate-400 font-mono">Latest Block #824913</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#05111d] border border-slate-900/80 px-4 py-2.5 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-400/20 flex items-center justify-center">
                  <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
                <div className="leading-tight">
                  <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none">NETWORK STATUS</span>
                  <strong className="text-[10px] text-emerald-400 font-bold block mt-1 uppercase">HEALTHY</strong>
                  <span className="text-[8px] text-slate-400 font-mono">All Systems Online</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#05111d] border border-slate-900/80 px-4 py-2.5 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-400/20 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="leading-tight">
                  <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none">ENCRYPTION</span>
                  <strong className="text-[10px] text-emerald-400 font-bold block mt-1 uppercase text-nowrap">END-TO-END</strong>
                  <span className="text-[8px] text-slate-400 font-mono">AES-256 • RSA-4096</span>
                </div>
              </div>

              {/* Patient Badge profile & quick notifications bell */}
              <div className="flex items-center gap-3.5 pl-2.5 border-l border-slate-900">
                <button className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 transition-all text-slate-400 hover:text-white">
                  <Bell className="w-4.5 h-4.5" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                </button>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)] bg-slate-950">
                    <img
                      src={avatarImg}
                      alt={identity.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="leading-tight hidden sm:block">
                    <span className="block text-xs font-bold text-white">{identity.name}</span>
                    <span className="block text-[9px] font-mono text-slate-500">Patient ID: {identity.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Actual Active component workspace rendering */}
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

