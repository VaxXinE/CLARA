import type { AiConversationSummaryProvider } from "./ai-conversation-summary-provider";
import type {
  AiConversationSummaryProviderInput,
  AiConversationSummaryProviderResult,
} from "./ai-conversation-summary-types";

export class MockAiConversationSummaryProvider implements AiConversationSummaryProvider {
  async generateSummary(
    input: AiConversationSummaryProviderInput,
  ): Promise<AiConversationSummaryProviderResult> {
    const style =
      input.summaryStyle === "bullet_points"
        ? "bullet point"
        : input.summaryStyle;

    return {
      provider: "mock",
      model: "mock-clara-conversation-summary-v1",
      summaryText: `Review-only ${style} summary for this conversation.`,
      keyPoints: ["Customer needs a human-reviewed response."],
      openQuestions: ["Confirm the next safe operator action."],
      riskFlags: [],
      safetyFlags: [],
    };
  }
}
