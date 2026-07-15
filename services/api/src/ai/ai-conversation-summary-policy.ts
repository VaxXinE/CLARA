import type { SafeAiContext } from "./ai-context-types";
import { detectPromptInjectionIntent } from "./ai-prompt-injection-policy";
import type {
  AiConversationSummaryProviderResult,
  AiConversationSummarySafeReasonCode,
} from "./ai-conversation-summary-types";

export type AiConversationSummaryPolicyBlock = {
  reasonCode: Exclude<
    AiConversationSummarySafeReasonCode,
    "ai_human_approval_required"
  >;
  blockedReason: string;
  safetyFlags: string[];
};

const unsafeTextPattern =
  /(access[_ -]?token|refresh[_ -]?token|authorization|cookie|client[_ -]?secret|raw[_ -]?(provider|webhook|dom|html)|auto[- ]?(send|write|schedule|mutate)|already (sent|scheduled|created|updated|wrote)|wrote (a )?customer note|updated (the )?customer|changed (the )?role|invited user|deleted user)/i;

export function findConversationSummaryContextBlock(
  context: SafeAiContext,
): AiConversationSummaryPolicyBlock | null {
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

export function findConversationSummaryOutputBlock(
  output: AiConversationSummaryProviderResult,
): AiConversationSummaryPolicyBlock | null {
  const text = [
    output.summaryText,
    ...output.keyPoints,
    ...output.openQuestions,
    ...output.riskFlags,
  ].join(" ");

  if (unsafeTextPattern.test(text)) {
    return {
      reasonCode: "ai_policy_blocked",
      blockedReason:
        "Provider output attempted to expose secrets or claim a persistent action.",
      safetyFlags: ["provider_output_blocked"],
    };
  }

  return null;
}
