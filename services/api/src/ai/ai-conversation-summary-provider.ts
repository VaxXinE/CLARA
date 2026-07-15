import type {
  AiConversationSummaryProviderInput,
  AiConversationSummaryProviderResult,
} from "./ai-conversation-summary-types";

export type AiConversationSummaryProvider = {
  generateSummary(
    input: AiConversationSummaryProviderInput,
  ): Promise<AiConversationSummaryProviderResult>;
};
