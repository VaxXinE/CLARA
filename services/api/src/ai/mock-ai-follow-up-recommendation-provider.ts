import type { AiFollowUpRecommendationProvider } from "./ai-follow-up-recommendation-provider";
import type {
  AiFollowUpRecommendationItem,
  AiFollowUpRecommendationProviderInput,
  AiFollowUpRecommendationProviderResult,
} from "./ai-follow-up-recommendation-types";

export class MockAiFollowUpRecommendationProvider implements AiFollowUpRecommendationProvider {
  async generateRecommendations(
    input: AiFollowUpRecommendationProviderInput,
  ): Promise<AiFollowUpRecommendationProviderResult> {
    const recommendations: AiFollowUpRecommendationItem[] = [
      {
        recommendationType: "follow_up_later",
        title: "Follow up after checking the customer request",
        rationale: "The conversation still needs a human-reviewed next step.",
        suggestedTiming:
          input.urgency === "high" ? "Today" : "Next business day",
        suggestedMessage:
          "I will check the latest details and follow up with the right next step.",
        priority: input.urgency,
        requiresHumanApproval: true,
        actionStatus: "recommendation_only",
      },
    ];

    return {
      provider: "mock",
      model: "mock-clara-follow-up-recommendation-v1",
      recommendations: recommendations.slice(0, input.maxRecommendations),
      summary: "Recommendation-only follow-up guidance for human review.",
      safetyFlags: [],
    };
  }
}
