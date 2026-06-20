/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Send,
  MessageSquare,
  AlertTriangle,
  History,
  Lock,
  Compass,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { aiGuardianService, ConsentRiskAudit, ChatMessage } from "../../services/ai";
import GlassCard from "../../components/GlassCard";

export default function AIGuardian() {
  const [audits, setAudits] = useState<ConsentRiskAudit[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<ConsentRiskAudit | null>(null);
  const [selectedPolicyMap, setSelectedPolicyMap] = useState<Record<string, ConsentRiskAudit["recommendedPolicy"]>>({});

  // Chat/Negotiator State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m_001",
      sender: "guardian",
      text: "VITAL_TWIN_GUARDIAN_BOT: Active diagnostic surveillance channel online. Send any medical data request link, or ask me about privacy risks regarding genomic data sharing.",
      timestamp: "Just now"
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentStreamingText, setCurrentStreamingText] = useState("");
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions
  const quickQuestions = [
    "Is it safe to share my genetic data with Astra-Pharma?",
    "Should I approve Genomic Labs requesting Cardiac Telemetry?",
    "Explain the high risk warning for Neo-Life Insurance request",
    "How does the Sovereign Consent Ledger protect my privacy?"
  ];

  useEffect(() => {
    async function loadAudits() {
      const data = await aiGuardianService.getLatestAudits();
      setAudits(data);
      if (data.length > 0) {
        setSelectedAudit(data[0]);
        // Seed default policies based on recommendation
        const initialPolicies: Record<string, ConsentRiskAudit["recommendedPolicy"]> = {};
        data.forEach(a => {
          initialPolicies[a.id] = a.recommendedPolicy;
        });
        setSelectedPolicyMap(initialPolicies);
      }
    }
    loadAudits();
  }, []);

  // Scroll to bottom helper
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentStreamingText, isTyping]);

  const handleAskGuardian = (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsgId = "m_" + Math.random().toString(36).substring(2, 9);
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setUserInput("");
    setIsTyping(true);
    setCurrentStreamingText("");

    // Simulate think block delay, then start the stream
    setTimeout(() => {
      aiGuardianService.generateGuardianResponse(
        questionText,
        (chunk) => {
          setCurrentStreamingText(chunk);
        },
        (fullText) => {
          const responseId = "m_" + Math.random().toString(36).substring(2, 9);
          setMessages((prev) => [
            ...prev,
            {
              id: responseId,
              sender: "guardian",
              text: fullText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          setIsTyping(false);
          setCurrentStreamingText("");
        }
      );
    }, 900);
  };

  const handlePolicyChange = (auditId: string, policy: ConsentRiskAudit["recommendedPolicy"]) => {
    setSelectedPolicyMap(prev => ({
      ...prev,
      [auditId]: policy
    }));
  };

  return (
    <div id="ai-guardian-center" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Risks audit panel and Risk level dynamic meters */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard glowColor="none" hoverable={false} className="p-5 bg-slate-950/40">
            <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display font-medium text-sm text-white">Continuous AI Privacy Audit</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Real-time inspection of active data sharing authorization payloads.</p>
              </div>
              <Cpu className="w-5 h-5 text-neon-cyan animate-pulse" />
            </div>

            <div className="space-y-3.5 mt-4">
              {audits.map((audit) => {
                const isSelected = selectedAudit?.id === audit.id;
                const policy = selectedPolicyMap[audit.id] || audit.recommendedPolicy;
                
                return (
                  <div
                    id={`audit-card-${audit.id}`}
                    key={audit.id}
                    onClick={() => setSelectedAudit(audit)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? "bg-slate-950/90 border-neon-cyan"
                        : "bg-slate-950/30 border-slate-900/60 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="font-mono text-[8px] uppercase font-bold text-slate-500 tracking-wider">
                          REQ_PAYLOAD_NODE
                        </span>
                        <h4 className="text-xs font-bold text-slate-200">{audit.requesterName}</h4>
                        <span className="font-mono text-[9px] text-slate-400 block truncate max-w-sm">
                          Scope: {audit.requestedDataScope}
                        </span>
                      </div>

                      {/* Visual indicator of score */}
                      <div className="text-right flex flex-col items-end">
                        <span className={`font-mono text-[10px] font-bold ${
                          audit.riskScore > 75 ? "text-red-400" : audit.riskScore > 40 ? "text-neon-purple" : "text-neon-green"
                        }`}>
                          Risk Score: {audit.riskScore}%
                        </span>
                        <span className={`text-[8px] font-mono font-bold mt-1 px-1.5 py-0.5 rounded uppercase ${
                          audit.riskLevel === "HIGH" || audit.riskLevel === "CRITICAL"
                            ? "bg-red-950/30 text-red-400 border border-red-900/40"
                            : audit.riskLevel === "MEDIUM"
                            ? "bg-neon-purple/15 text-neon-purple border border-neon-purple/20"
                            : "bg-neon-green/10 text-neon-green border border-neon-green/20"
                        }`}>
                          {audit.riskLevel}
                        </span>
                      </div>
                    </div>

                    {/* Expand mini info card */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-3 border-t border-slate-900 space-y-3 font-mono text-[11px]"
                      >
                        <p className="text-slate-400 leading-relaxed text-[10px]">
                          {audit.justificationReasoning}
                        </p>

                        {/* Interactive policy decision inside card */}
                        <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-900/60">
                          <span className="text-slate-500 text-[9px] font-bold uppercase">Enforced Policy</span>
                          
                          <div className="flex gap-1.5">
                            {(["APPROVE", "RESTRICT", "DENY"] as const).map((pol) => {
                              const isActive = policy === pol;
                              return (
                                <button
                                  key={pol}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePolicyChange(audit.id, pol);
                                  }}
                                  className={`px-2.5 py-1 rounded text-[8px] font-bold tracking-wider transition-all border cursor-pointer ${
                                    isActive
                                      ? pol === "APPROVE"
                                        ? "bg-neon-green/20 border-neon-green/40 text-neon-green"
                                        : pol === "RESTRICT"
                                        ? "bg-neon-purple/20 border-neon-purple/40 text-neon-purple"
                                        : "bg-red-950/35 border-red-900/40 text-red-400"
                                      : "bg-slate-950 text-slate-500 border-slate-900 hover:text-slate-300"
                                  }`}
                                >
                                  {pol}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Glowing Animated Meter Panel */}
          {selectedAudit && (
            <GlassCard glowColor={selectedAudit.riskScore > 70 ? "purple" : "cyan"} hoverable={false} className="p-5">
              <h4 className="font-display font-bold text-xs text-slate-200 border-b border-slate-900 pb-2.5 mb-4">
                Telemetry Analytics: {selectedAudit.requesterName}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Dial circular meter */}
                <div className="md:col-span-4 flex flex-col items-center justify-center">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    {/* Ring background */}
                    <div className="absolute inset-0 rounded-full border-4 border-slate-950" />
                    
                    {/* Colored dynamic ring */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="50"
                        className="stroke-current text-slate-900"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="50"
                        className={`stroke-current ${
                          selectedAudit.riskScore > 75 
                            ? "text-red-500" 
                            : selectedAudit.riskScore > 40 
                            ? "text-neon-purple" 
                            : "text-neon-cyan"
                        }`}
                        strokeWidth="5"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 50}
                        strokeDashoffset={2 * Math.PI * 50 * (1 - selectedAudit.riskScore / 100)}
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center font-mono leading-none">
                      <span className="text-xl font-black text-white">{selectedAudit.riskScore}%</span>
                      <span className="text-[7px] text-slate-500 font-bold uppercase mt-1">RAW_RISK_RATIO</span>
                    </div>
                  </div>
                </div>

                {/* Privacy Alerts list */}
                <div className="md:col-span-8 space-y-2.5">
                  <span className="font-mono text-[8px] text-slate-500 block uppercase tracking-wider font-bold">
                    TRIGGERED_PRIVACY_ALERTS
                  </span>
                  
                  <div className="space-y-1.5 scrollbar-thin max-h-[140px] overflow-y-auto pr-1">
                    {selectedAudit.privacyAlerts.map((alert, idx) => (
                      <div key={idx} className="flex gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-900 leading-tight font-mono text-[10px]">
                        <ShieldAlert className="w-3.5 h-3.5 text-neon-purple shrink-0 mt-0.5" />
                        <span className="text-slate-300">{alert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right column: Interactive "AI Consent Negotiator" chat panel */}
        <div className="lg:col-span-5">
          <GlassCard glowColor="cyan" hoverable={false} className="p-5 flex flex-col h-[560px] justify-between">
            {/* Advisor header */}
            <div className="border-b border-slate-900 pb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                <Compass className="w-4.5 h-4.5 text-neon-cyan animate-pulse" />
              </div>
              <div>
                <h4 className="font-display font-medium text-xs text-white">Consent Policy Negotiator</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon-green animate-ping" />
                  <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">A_AGNT_ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Chat message content box */}
            <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-3.5 scrollbar-thin select-text">
              {messages.map((m) => {
                const isBot = m.sender === "guardian";
                return (
                  <div
                    key={m.id}
                    className={`flex ${isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2.5 text-xs font-mono border leading-relaxed ${
                        isBot
                          ? "bg-slate-950/60 border-slate-900/60 text-slate-300 rounded-bl-sm"
                          : "bg-neon-cyan/5 border-neon-cyan/20 text-white rounded-br-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      <span className="block text-[8px] text-slate-500 text-right mt-1.5 lowercase">
                        {m.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Streaming active chunk container */}
              {isTyping && currentStreamingText && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-xl px-3 py-2.5 text-xs font-mono border border-neon-cyan/40 bg-slate-900/40 text-slate-200 rounded-bl-sm">
                    <p className="whitespace-pre-wrap">{currentStreamingText}</p>
                    <span className="inline-block w-1.5 h-3 bg-neon-cyan animate-pulse ml-0.5" />
                  </div>
                </div>
              )}

              {/* Thinking loader placeholder */}
              {isTyping && !currentStreamingText && (
                <div className="flex justify-start items-center gap-1.5 p-2 font-mono text-[9px] text-slate-500">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-neon-blue" />
                  <span>NEGOTIATOR_IS_THINKING...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggested Prompt Row */}
            <div className="mb-3.5 border-t border-slate-900/50 pt-3.5">
              <span className="font-mono text-[8px] text-slate-500 block uppercase tracking-wider mb-2 font-bold select-none">
                QUICK_AUDIT_PROMPTS
              </span>
              <div className="flex flex-col gap-1.5">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAskGuardian(q)}
                    className="flex items-center justify-between text-left font-mono text-[9px] px-2.5 py-1.5 rounded-lg border border-slate-900 bg-slate-950/50 text-slate-400 hover:text-white hover:border-slate-800 transition-all cursor-pointer"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600 shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Message input prompt form bar */}
            <div className="relative">
              <input
                id="guardian-chat-input"
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAskGuardian(userInput);
                  }
                }}
                disabled={isTyping}
                placeholder="Ask sovereign model (e.g. is my MRI safe?)..."
                className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-4 pr-11 py-2.5 font-mono text-xs text-slate-300 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all"
              />
              <button
                id="msg-send-btn"
                type="button"
                disabled={isTyping || !userInput.trim()}
                onClick={() => handleAskGuardian(userInput)}
                className="absolute inset-y-1 right-1 px-3 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-neon-cyan hover:text-white transition-all flex items-center justify-center cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
