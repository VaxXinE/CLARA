import { detectPromptInjectionIntent } from "./ai-prompt-injection-policy";
import type { SafeAiContext } from "./ai-context-types";
import type { AiReplySuggestionProviderResult } from "./ai-reply-suggestion-types";

export type AiReplySuggestionPolicyBlock = {
  reasonCode: "ai_prompt_injection_flagged" | "ai_policy_blocked";
  blockedReason: string;
  safetyFlags: string[];
};

export function findReplySuggestionContextBlock(
  context: SafeAiContext,
): AiReplySuggestionPolicyBlock | null {
  for (const block of context.untrustedContent) {
    const intent = detectPromptInjectionIntent(block.text);

    if (intent) {
      return {
        reasonCode: "ai_prompt_injection_flagged",
        blockedReason:
          "Untrusted customer content attempted to override assistant policy.",
        safetyFlags: [intent],
      };
    }
  }

  return null;
}

export function findReplySuggestionOutputBlock(
  output: AiReplySuggestionProviderResult,
): AiReplySuggestionPolicyBlock | null {
  const text = `${output.suggestedText} ${output.recommendedNextAction}`;

  if (
    /(already sent|was sent|I sent|message sent|sent the reply)/i.test(text)
  ) {
    return {
      reasonCode: "ai_policy_blocked",
      blockedReason:
        "Provider output claimed a customer-visible action was completed.",
      safetyFlags: ["provider_claimed_action_completed"],
    };
  }

  if (/(bypass|skip).*(approval|review)/i.test(text)) {
    return {
      reasonCode: "ai_policy_blocked",
      blockedReason: "Provider output attempted to bypass human approval.",
      safetyFlags: ["provider_bypassed_human_approval"],
    };
  }

  return null;
}
