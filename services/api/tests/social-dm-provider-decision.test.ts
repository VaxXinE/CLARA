import { describe, expect, it } from "vitest";
import {
  getSocialDmProviderDecision,
  socialDmProviderDecisions,
} from "../src/channels/social/social-dm-provider-decision";

describe("social DM provider decisions", () => {
  it("keeps Instagram and TikTok decision-only and official-API-only", () => {
    expect(socialDmProviderDecisions).toHaveLength(2);

    for (const decision of socialDmProviderDecisions) {
      expect(decision.status).toBe("planned");
      expect(decision.officialApiRequired).toBe(true);
      expect(decision.productionAvailable).toBe(false);
      expect(decision.rejectedStrategies).toEqual(
        expect.arrayContaining([
          "scraping",
          "browser_automation",
          "session_cookie_reuse",
          "qr_hijacking",
          "unofficial_client_libraries",
          "credential_capture",
        ]),
      );
    }

    expect(getSocialDmProviderDecision("instagram")?.provider).toBe(
      "instagram",
    );
    expect(getSocialDmProviderDecision("tiktok")?.provider).toBe("tiktok");
  });
});
