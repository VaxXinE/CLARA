import type { AuthContext } from "../auth/auth-context";
import type { AiContextBudgetSummary } from "./ai-context-types";
import type { AiPromptMessage } from "./ai-prompt-message-builder";

export type AiConversationSummaryStyle = "brief" | "detailed" | "bullet_points";

export type AiConversationSummarySafeReasonCode =
  | "ai_conversation_summary_generated"
  | "ai_prompt_injection_flagged"
  | "ai_policy_blocked"
  | "ai_human_approval_required";

export type AiConversationSummaryRequest = {
  auth: AuthContext;
  conversationId: string;
  correlationId: string;
  customerId?: string;
  taskType?: "conversation_summary";
  operatorInstruction?: string;
  summaryStyle?: AiConversationSummaryStyle;
  maxLength?: number;
};

export type AiConversationSummaryProviderInput = {
  messages: AiPromptMessage[];
  summaryStyle: AiConversationSummaryStyle;
  maxLength: number;
  operatorInstruction: string | null;
};

export type AiConversationSummaryProviderResult = {
  provider: "mock";
  model: string;
  summaryText: string;
  keyPoints: string[];
  openQuestions: string[];
  riskFlags: string[];
  safetyFlags: string[];
};

export type AiConversationSummaryDto = {
  summaryId: string;
  type: "conversation_summary";
  conversationId: string;
  customerId: string | null;
  summaryText: string | null;
  keyPoints: string[];
  openQuestions: string[];
  riskFlags: string[];
  safetyFlags: string[];
  requiresHumanApproval: true;
  blockedReason: string | null;
  safeReasonCode: AiConversationSummarySafeReasonCode;
  contextBudgetSummary: AiContextBudgetSummary;
  policyVersion: string;
  createdAt: string;
};

export type AiConversationSummaryResponse = {
  data: {
    summary: AiConversationSummaryDto;
    ai: {
      provider: "mock";
      model: string;
    };
  };
};
