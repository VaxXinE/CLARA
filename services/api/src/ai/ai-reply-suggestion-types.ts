import type { AuthContext } from "../auth/auth-context";
import type { AiContextBudgetSummary } from "./ai-context-types";
import type { AiPromptMessage } from "./ai-prompt-message-builder";

export type AiReplySuggestionTone =
  "professional" | "friendly" | "concise" | "empathetic";

export type AiReplySuggestionRequest = {
  auth: AuthContext;
  conversationId: string;
  correlationId: string;
  customerId?: string;
  taskType?: "reply_suggestion";
  operatorInstruction?: string;
  tone?: AiReplySuggestionTone;
  maxLength?: number;
};

export type AiReplySuggestionProviderInput = {
  messages: AiPromptMessage[];
  tone: AiReplySuggestionTone;
  maxLength: number;
  operatorInstruction: string | null;
};

export type AiReplySuggestionProviderResult = {
  provider: "mock";
  model: string;
  suggestedText: string;
  summary: string;
  recommendedNextAction: string;
  safetyFlags: string[];
};

export type AiReplySuggestionSafeReasonCode =
  | "ai_suggestion_generated"
  | "ai_prompt_injection_flagged"
  | "ai_policy_blocked"
  | "ai_human_approval_required";

export type AiReplySuggestionDto = {
  suggestionId: string;
  type: "reply_suggestion";
  conversationId: string;
  customerId: string | null;
  suggestedText: string | null;
  summary: string | null;
  recommendedNextAction: string | null;
  safetyFlags: string[];
  requiresHumanApproval: true;
  blockedReason: string | null;
  safeReasonCode: AiReplySuggestionSafeReasonCode;
  contextBudgetSummary: AiContextBudgetSummary;
  policyVersion: string;
  createdAt: string;
};

export type AiReplySuggestionResponse = {
  data: {
    suggestion: AiReplySuggestionDto;
    ai: {
      provider: "mock";
      model: string;
    };
  };
};
