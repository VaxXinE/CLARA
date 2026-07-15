import type { AuthContext } from "../auth/auth-context";

export const aiAutomationSourceFeatures = [
  "reply_suggestion",
  "draft_review",
  "follow_up_recommendation",
  "conversation_summary",
  "customer_note_suggestion",
  "future_automation",
] as const;

export type AiAutomationSourceFeature =
  (typeof aiAutomationSourceFeatures)[number];

export type AiAutomationDecision =
  "allowed" | "requires_human_approval" | "blocked";

export type AiAutomationRiskLevel = "low" | "medium" | "high" | "critical";

export type AiAutomationEvaluationInput = {
  auth: AuthContext;
  correlationId: string;
  requestedAction: string;
  sourceFeature: AiAutomationSourceFeature;
  conversationId?: string;
  customerId?: string;
  operatorInstruction?: string;
  aiOutput?: string;
  clientWorkspaceId?: string;
};

export type AiAutomationGuardrailResult = {
  decisionId: string;
  decision: AiAutomationDecision;
  actionType: string;
  riskLevel: AiAutomationRiskLevel;
  blockedReason: string | null;
  safeReasonCode: string;
  safetyFlags: string[];
  requiresHumanApproval: boolean;
  actionStatus: "evaluation_only";
  policyVersion: string;
  createdAt: string;
};

export type AiAutomationGuardrailResponse = {
  data: {
    guardrail: AiAutomationGuardrailResult;
  };
};
