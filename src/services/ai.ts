/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ConsentRiskAudit {
  id: string;
  requesterName: string;
  requesterType: "INSURANCE" | "RESEARCH_LAB" | "HOSPITAL" | "PHARMACEUTICAL";
  requestedDataScope: string;
  riskScore: number; // 0 - 100
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  privacyAlerts: string[];
  justificationReasoning: string;
  recommendedPolicy: "APPROVE" | "RESTRICT" | "DENY";
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "guardian";
  text: string;
  timestamp: string;
}

const RESEARCH_QUESTIONS = [
  "is it safe to share my genetic data with astra-pharma?",
  "how does the sovereign consent ledger protect my privacy?",
  "explain the high risk warning for neo-life insurance request",
  "what happens if a medical researcher copies my synapse scan?",
  "should i approve genomic labs requesting cardiac telemetry?"
];

export const aiGuardianService = {
  getLatestAudits: async (): Promise<ConsentRiskAudit[]> => {
    return [
      {
        id: "audit_101",
        requesterName: "Neo-Life Underwriters Corp",
        requesterType: "INSURANCE",
        requestedDataScope: "Full Genome resonance sequencing & 30-day continuous cardiac vitals",
        riskScore: 88,
        riskLevel: "HIGH",
        privacyAlerts: [
          "Risk of pre-existing condition dynamic pricing adjustments",
          "Permanent correlation of genomic sequence with credit history identifiers",
          "Third-party secondary broker sharing permission clauses detected"
        ],
        justificationReasoning: "The requester is utilizing insurance assessment engines. Sharing raw DNA sequencing data allows automated algorithmic underwriting models to modify pricing matrices dynamically. Secondary clauses authorize sharing data with subsidiary partners.",
        recommendedPolicy: "DENY",
        timestamp: "5 mins ago"
      },
      {
        id: "audit_102",
        requesterName: "Global Longevity Genome Initiative",
        requesterType: "RESEARCH_LAB",
        requestedDataScope: "Anonymized synaptic resilience markers (HLA gene cluster)",
        riskScore: 24,
        riskLevel: "LOW",
        privacyAlerts: [
          "None. Fully zero-knowledge cryptographic proof enforced"
        ],
        justificationReasoning: "Requester utilizes fully audited smart contract proxies. Telemetry is zero-knowledge summarized on patient node - raw data never leaves the glass-membrane vault. Contributes directly to neural-regeneration treatment schemas.",
        recommendedPolicy: "APPROVE",
        timestamp: "1 hour ago"
      },
      {
        id: "audit_103",
        requesterName: "Aetheric Synapsis Core Host",
        requesterType: "HOSPITAL",
        requestedDataScope: "Gamma wave coherence charts and clinical prescription log",
        riskScore: 48,
        riskLevel: "MEDIUM",
        privacyAlerts: [
          "Active diagnostic notes correlation requested",
          "Potential linkage with external biometric indexes"
        ],
        justificationReasoning: "Permitting clinical access supports treatment calibration but the network link remains active for 120 cycles. Requires automatic expiry parameter injection to protect historical archive records.",
        recommendedPolicy: "RESTRICT",
        timestamp: "3 hours ago"
      }
    ];
  },

  // Generates streaming chunks simulating real-time LLM reasoning
  generateGuardianResponse: (
    userQuestion: string,
    onChunk: (chunk: string) => void,
    onComplete: (fullText: string) => void
  ) => {
    const questionLower = userQuestion.toLowerCase();
    let reply = "";

    // Comprehensive contextual reasoning templates
    if (questionLower.includes("astra") || questionLower.includes("pharma") || questionLower.includes("pharmaceutical")) {
      reply = "ANALYSIS COMPLETE: Astra-Pharma is requesting cognitive metabolic telemetry and HLX genomic vectors. Under sovereign standards, raw genetic profiles contain non-repudiable biometric signatures. If shared, there is a 72% chance of cross-matching against open genealogy indices, creating a durable privacy footprint. I highly recommend wrapping this stream in a Zero-Knowledge telemetry envelope or selecting a 'RESTRICTED' policy to block active raw data serialization.";
    } else if (questionLower.includes("insurance") || questionLower.includes("neo-life") || questionLower.includes("risk")) {
      reply = "WARNING: Risk parameters for Neo-Life Underwriters are categorized as CRITICAL (Risk Score: 88%). Dynamic correlation is configured in their request package. Allowing this connection authorizes their neural ledger systems of record to monitor your synaptic performance in real-time, which could trigger automatic sub-optimal metabolic lifestyle warnings and dynamically raise premium rates. Recommended Action: Select full ledger isolation and decline the handshake transit.";
    } else if (questionLower.includes("ledger") || questionLower.includes("sovereign") || questionLower.includes("protect")) {
      reply = "SECURE PROTOCOL CONFIRMED: The Sovereign Health Ledger implements client-side encryption. Any external requester receives unidirectional keys that sign dynamic biometric pulses from the membrane of the Sovereign Vault. Your raw genetic data is never stored outside high-refractive client containers, and you have instant revocation authority over active transport pipelines. The current membrane integrity is validated at 99.987% FLUID.";
    } else if (questionLower.includes("mri") || questionLower.includes("scan") || questionLower.includes("synapse")) {
      reply = "NEURAL COHERENCE AUDIT: High-resolution brainwave MRI scans expose distinct cognitive patterns that act as human-unique identifiers. Researchers using this data can cross-reference temporal patterns with active VR navigation logs to accurately deanonymize identity nodes. When sharing imaging, you should always authorize only downsampled slice telemetry models rather than raw structural files.";
    } else {
      reply = `GUARDIAN DEEP RESIDUE AGENT REPORT: I have scanned the network for queries related to your inquiry. The current active policies in your health container defend against unsolicited biometric profiling. When negotiating telemetry handshakes, always configure an ephemeral auto-expiration condition (e.g., 24-hour medical transit keys). Is there a specific protocol or contract link you want me to inspect?`;
    }

    const words = reply.split(" ");
    let currentIdx = 0;
    let accumulated = "";

    const timer = setInterval(() => {
      if (currentIdx < words.length) {
        accumulated += (currentIdx === 0 ? "" : " ") + words[currentIdx];
        onChunk(accumulated);
        currentIdx++;
      } else {
        clearInterval(timer);
        onComplete(accumulated);
      }
    }, 45); // highly realistic elegant streaming rate
  }
};
