import type { AiCustomerNoteSuggestionProvider } from "./ai-customer-note-suggestion-provider";
import type {
  AiCustomerNoteSuggestionProviderInput,
  AiCustomerNoteSuggestionProviderResult,
} from "./ai-customer-note-suggestion-types";

export class MockAiCustomerNoteSuggestionProvider implements AiCustomerNoteSuggestionProvider {
  async generateNoteSuggestion(
    input: AiCustomerNoteSuggestionProviderInput,
  ): Promise<AiCustomerNoteSuggestionProviderResult> {
    return {
      provider: "mock",
      model: "mock-clara-customer-note-suggestion-v1",
      suggestedNote: `Review-only ${input.noteStyle.replaceAll("_", " ")} for the customer profile.`,
      suggestedTags: ["needs_review"],
      confidenceLevel: "medium",
      safetyFlags: [],
    };
  }
}
