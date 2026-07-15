import type { AuthContext } from "../auth/auth-context";
import type { AiContextBudgetSummary } from "./ai-context-types";
import type { AiPromptMessage } from "./ai-prompt-message-builder";

export type AiCustomerNoteStyle =
  "short_note" | "sales_context" | "support_context";

export type AiCustomerNoteSafeReasonCode =
  | "ai_customer_note_suggestion_generated"
  | "ai_prompt_injection_flagged"
  | "ai_policy_blocked"
  | "ai_human_approval_required";

export type AiCustomerNoteSuggestionRequest = {
  auth: AuthContext;
  conversationId: string;
  customerId: string;
  correlationId: string;
  taskType?: "customer_note_summary";
  operatorInstruction?: string;
  noteStyle?: AiCustomerNoteStyle;
  maxLength?: number;
};

export type AiCustomerNoteSuggestionProviderInput = {
  messages: AiPromptMessage[];
  noteStyle: AiCustomerNoteStyle;
  maxLength: number;
  operatorInstruction: string | null;
};

export type AiCustomerNoteSuggestionProviderResult = {
  provider: "mock";
  model: string;
  suggestedNote: string;
  suggestedTags: string[];
  confidenceLevel: "low" | "medium" | "high";
  safetyFlags: string[];
};

export type AiCustomerNoteSuggestionDto = {
  noteSuggestionId: string;
  type: "customer_note_suggestion";
  conversationId: string;
  customerId: string;
  suggestedNote: string | null;
  suggestedTags: string[];
  confidenceLevel: "low" | "medium" | "high";
  safetyFlags: string[];
  requiresHumanApproval: true;
  actionStatus: "suggestion_only";
  blockedReason: string | null;
  safeReasonCode: AiCustomerNoteSafeReasonCode;
  contextBudgetSummary: AiContextBudgetSummary;
  policyVersion: string;
  createdAt: string;
};

export type AiCustomerNoteSuggestionResponse = {
  data: {
    noteSuggestion: AiCustomerNoteSuggestionDto;
    ai: {
      provider: "mock";
      model: string;
    };
  };
};
