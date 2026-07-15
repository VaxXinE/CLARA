import type { AuthContext } from "../auth/auth-context";
import type { AiContextBudgetSummary } from "./ai-context-types";
import type { AiPromptMessage } from "./ai-prompt-message-builder";

export type AiFollowUpUrgency = "low" | "normal" | "high";

export type AiFollowUpRecommendationType =
  | "follow_up_later"
  | "ask_for_missing_information"
  | "escalate_to_human"
  | "suggest_reply"
  | "review_customer_context"
  | "mark_needs_attention"
  | "no_follow_up_needed";

export type AiFollowUpSafeReasonCode =
  | "ai_follow_up_recommendation_generated"
  | "ai_prompt_injection_flagged"
  | "ai_policy_blocked"
  | "ai_human_approval_required";

export type AiFollowUpRecommendationRequest = {
  auth: AuthContext;
  conversationId: string;
  correlationId: string;
  customerId?: string;
  taskType?: "follow_up_suggestion";
  operatorInstruction?: string;
  urgency?: AiFollowUpUrgency;
  maxRecommendations?: number;
};

export type AiFollowUpRecommendationProviderInput = {
  messages: AiPromptMessage[];
  urgency: AiFollowUpUrgency;
  maxRecommendations: number;
  operatorInstruction: string | null;
};

export type AiFollowUpRecommendationItem = {
  recommendationType: AiFollowUpRecommendationType;
  title: string;
  rationale: string;
  suggestedTiming: string | null;
  suggestedMessage: string | null;
  priority: AiFollowUpUrgency;
  requiresHumanApproval: true;
  actionStatus: "recommendation_only";
};

export type AiFollowUpRecommendationProviderResult = {
  provider: "mock";
  model: string;
  recommendations: AiFollowUpRecommendationItem[];
  summary: string | null;
  safetyFlags: string[];
};

export type AiFollowUpRecommendationDto = {
  recommendationId: string;
  type: "follow_up_recommendation";
  conversationId: string;
  customerId: string | null;
  recommendations: AiFollowUpRecommendationItem[];
  summary: string | null;
  safetyFlags: string[];
  requiresHumanApproval: true;
  blockedReason: string | null;
  safeReasonCode: AiFollowUpSafeReasonCode;
  contextBudgetSummary: AiContextBudgetSummary;
  policyVersion: string;
  createdAt: string;
};

export type AiFollowUpRecommendationResponse = {
  data: {
    recommendation: AiFollowUpRecommendationDto;
    ai: {
      provider: "mock";
      model: string;
    };
  };
};
