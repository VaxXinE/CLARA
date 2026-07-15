import type {
  AiAutomationDecision,
  AiAutomationRiskLevel,
} from "./ai-automation-guardrail-types";

export type AiAutomationRiskPolicyResult = {
  decision: AiAutomationDecision;
  riskLevel: AiAutomationRiskLevel;
  requiresHumanApproval: boolean;
  safeReasonCode: string;
  blockedReason: string | null;
};

export function evaluateAiAutomationRisk(input: {
  category: "allowed" | "restricted" | "blocked";
  abuseDetected: boolean;
  crossWorkspaceAttempt: boolean;
}): AiAutomationRiskPolicyResult {
  if (input.crossWorkspaceAttempt) {
    return {
      decision: "blocked",
      riskLevel: "critical",
      requiresHumanApproval: false,
      safeReasonCode: "cross_workspace_action_blocked",
      blockedReason: "The requested action is outside the active workspace.",
    };
  }

  if (input.abuseDetected) {
    return {
      decision: "blocked",
      riskLevel: "critical",
      requiresHumanApproval: false,
      safeReasonCode: "ai_automation_abuse_detected",
      blockedReason: "The requested action violates automation policy.",
    };
  }

  if (input.category === "blocked") {
    return {
      decision: "blocked",
      riskLevel: "high",
      requiresHumanApproval: false,
      safeReasonCode: "ai_automation_action_blocked",
      blockedReason: "The requested action is not allowed.",
    };
  }

  if (input.category === "restricted") {
    return {
      decision: "requires_human_approval",
      riskLevel: "medium",
      requiresHumanApproval: true,
      safeReasonCode: "ai_automation_human_approval_required",
      blockedReason: null,
    };
  }

  return {
    decision: "allowed",
    riskLevel: "low",
    requiresHumanApproval: false,
    safeReasonCode: "ai_automation_allowed",
    blockedReason: null,
  };
}
