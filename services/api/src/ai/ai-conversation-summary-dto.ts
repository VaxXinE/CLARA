import type {
  AiConversationSummaryDto,
  AiConversationSummaryResponse,
} from "./ai-conversation-summary-types";

export function toAiConversationSummaryResponse(input: {
  summary: AiConversationSummaryDto;
  provider: "mock";
  model: string;
}): AiConversationSummaryResponse {
  return {
    data: {
      summary: input.summary,
      ai: {
        provider: input.provider,
        model: input.model,
      },
    },
  };
}
