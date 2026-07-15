import type {
  AiCustomerNoteSuggestionDto,
  AiCustomerNoteSuggestionResponse,
} from "./ai-customer-note-suggestion-types";

export function toAiCustomerNoteSuggestionResponse(input: {
  noteSuggestion: AiCustomerNoteSuggestionDto;
  provider: "mock";
  model: string;
}): AiCustomerNoteSuggestionResponse {
  return {
    data: {
      noteSuggestion: input.noteSuggestion,
      ai: {
        provider: input.provider,
        model: input.model,
      },
    },
  };
}
