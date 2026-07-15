import type { SafeAiContext } from "./ai-context-types";
import { detectPromptInjectionIntent } from "./ai-prompt-injection-policy";
import type {
  AiCustomerNoteSafeReasonCode,
  AiCustomerNoteSuggestionProviderResult,
} from "./ai-customer-note-suggestion-types";

export type AiCustomerNoteSuggestionPolicyBlock = {
  reasonCode: Exclude<
    AiCustomerNoteSafeReasonCode,
    "ai_human_approval_required"
  >;
  blockedReason: string;
  safetyFlags: string[];
};

const unsafeTextPattern =
  /(access[_ -]?token|refresh[_ -]?token|authorization|cookie|client[_ -]?secret|raw[_ -]?(provider|webhook|dom|html)|auto[- ]?(send|write|schedule|mutate)|already (sent|scheduled|created|updated|wrote)|wrote (a )?customer note|updated (the )?customer|changed (the )?role|invited user|deleted user)/i;

export function findCustomerNoteContextBlock(
  context: SafeAiContext,
): AiCustomerNoteSuggestionPolicyBlock | null {
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

export function findCustomerNoteOutputBlock(
  output: AiCustomerNoteSuggestionProviderResult,
): AiCustomerNoteSuggestionPolicyBlock | null {
  const text = [output.suggestedNote, ...output.suggestedTags].join(" ");

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
