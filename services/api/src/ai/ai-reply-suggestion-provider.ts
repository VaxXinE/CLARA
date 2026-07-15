import type {
  AiReplySuggestionProviderInput,
  AiReplySuggestionProviderResult,
} from "./ai-reply-suggestion-types";

export type AiReplySuggestionProvider = {
  generateSuggestion(
    input: AiReplySuggestionProviderInput,
  ): Promise<AiReplySuggestionProviderResult>;
};
