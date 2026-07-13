export type SocialDmProvider = "instagram" | "tiktok";

export type SocialDmProviderDecision = {
  provider: SocialDmProvider;
  status: "planned" | "disabled";
  officialApiRequired: true;
  productionAvailable: false;
  rejectedStrategies: string[];
  safeNotes: string;
};
