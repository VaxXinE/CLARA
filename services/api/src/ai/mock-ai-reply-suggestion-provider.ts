import type {
  AiReplySuggestionProviderInput,
  AiReplySuggestionProviderResult,
} from "./ai-reply-suggestion-types";
import type { AiReplySuggestionProvider } from "./ai-reply-suggestion-provider";

export class MockAiReplySuggestionProvider implements AiReplySuggestionProvider {
  async generateSuggestion(
    input: AiReplySuggestionProviderInput,
  ): Promise<AiReplySuggestionProviderResult> {
    const tonePrefix: Record<string, string> = {
      professional: "Thanks for reaching out.",
      friendly: "Hi, thanks for the message.",
      concise: "Thanks. Here is the short answer.",
      empathetic: "I understand this is important, and I can help.",
    };
    const text = `${tonePrefix[input.tone]} We are checking the latest context and will follow up with the right next step.`;

    return {
      provider: "mock",
      model: "mock-clara-reply-suggestion-v1",
      suggestedText: text.slice(0, input.maxLength),
      summary: "Draft a safe reply for human review.",
      recommendedNextAction:
        "Review the suggestion, edit if needed, then send manually.",
      safetyFlags: [],
    };
  }
}
