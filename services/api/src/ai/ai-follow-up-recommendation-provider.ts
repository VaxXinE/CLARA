import type {
  AiFollowUpRecommendationProviderInput,
  AiFollowUpRecommendationProviderResult,
} from "./ai-follow-up-recommendation-types";

export type AiFollowUpRecommendationProvider = {
  generateRecommendations(
    input: AiFollowUpRecommendationProviderInput,
  ): Promise<AiFollowUpRecommendationProviderResult>;
};
