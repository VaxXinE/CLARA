import type { SocialDmProviderDecision } from "./social-dm-provider-decision-types";

const rejectedStrategies = [
  "scraping",
  "browser_automation",
  "session_cookie_reuse",
  "qr_hijacking",
  "unofficial_client_libraries",
  "credential_capture",
];

export const socialDmProviderDecisions: SocialDmProviderDecision[] = [
  {
    provider: "instagram",
    status: "planned",
    officialApiRequired: true,
    productionAvailable: false,
    rejectedStrategies,
    safeNotes:
      "Decision-only metadata. Instagram DMs require an official API and compliance review before implementation.",
  },
  {
    provider: "tiktok",
    status: "planned",
    officialApiRequired: true,
    productionAvailable: false,
    rejectedStrategies,
    safeNotes:
      "Decision-only metadata. TikTok DMs require an official API and compliance review before implementation.",
  },
];

export function getSocialDmProviderDecision(provider: string) {
  return socialDmProviderDecisions.find((item) => item.provider === provider);
}
