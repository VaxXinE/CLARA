import { detectPromptInjectionIntent } from "./ai-prompt-injection-policy";
import type { SafeAiContext } from "./ai-context-types";
import type {
  AiFollowUpRecommendationItem,
  AiFollowUpRecommendationProviderResult,
  AiFollowUpSafeReasonCode,
} from "./ai-follow-up-recommendation-types";

export type AiFollowUpRecommendationPolicyBlock = {
  reasonCode: Exclude<AiFollowUpSafeReasonCode, "ai_human_approval_required">;
  blockedReason: string;
  safetyFlags: string[];
};

const allowedRecommendationTypes = new Set<
  AiFollowUpRecommendationItem["recommendationType"]
>([
  "follow_up_later",
  "ask_for_missing_information",
  "escalate_to_human",
  "suggest_reply",
  "review_customer_context",
  "mark_needs_attention",
  "no_follow_up_needed",
]);

const unsafeTextPattern =
  /(access[_ -]?token|refresh[_ -]?token|authorization|cookie|client[_ -]?secret|raw[_ -]?(provider|webhook|dom|html)|auto[- ]?(send|schedule|mutate)|already (sent|scheduled|created|updated)|created (a )?task|scheduled (a )?reminder|updated (the )?customer|changed (the )?role|invited user|deleted user)/i;

export function findFollowUpContextBlock(
  context: SafeAiContext,
): AiFollowUpRecommendationPolicyBlock | null {
  for (const block of context.untrustedContent) {
    const injection = detectPromptInjectionIntent(block.text);

    if (injection) {
      return {
        reasonCode: "ai_prompt_injection_flagged",
        blockedReason:
          "Untrusted customer content attempted to override assistant policy.",
        safetyFlags: [injection],
      };
    }

    if (unsafeTextPattern.test(block.text)) {
      return {
        reasonCode: "ai_policy_blocked",
        blockedReason: "Unsafe secret-like or autonomous-action content found.",
        safetyFlags: ["unsafe_context_blocked"],
      };
    }
  }

  return null;
}

export function findFollowUpOutputBlock(
  output: AiFollowUpRecommendationProviderResult,
): AiFollowUpRecommendationPolicyBlock | null {
  for (const item of output.recommendations) {
    if (!allowedRecommendationTypes.has(item.recommendationType)) {
      return {
        reasonCode: "ai_policy_blocked",
        blockedReason: "Provider returned an unsupported recommendation type.",
        safetyFlags: ["unsupported_recommendation_type"],
      };
    }

    const text = [
      item.title,
      item.rationale,
      item.suggestedTiming ?? "",
      item.suggestedMessage ?? "",
      item.actionStatus,
    ].join(" ");

    if (
      item.actionStatus !== "recommendation_only" ||
      unsafeTextPattern.test(text)
    ) {
      return {
        reasonCode: "ai_policy_blocked",
        blockedReason:
          "Provider output attempted to perform or claim an autonomous action.",
        safetyFlags: ["provider_autonomous_action_blocked"],
      };
    }
  }

  return null;
}
