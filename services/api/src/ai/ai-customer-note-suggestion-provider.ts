import type {
  AiCustomerNoteSuggestionProviderInput,
  AiCustomerNoteSuggestionProviderResult,
} from "./ai-customer-note-suggestion-types";

export type AiCustomerNoteSuggestionProvider = {
  generateNoteSuggestion(
    input: AiCustomerNoteSuggestionProviderInput,
  ): Promise<AiCustomerNoteSuggestionProviderResult>;
};
