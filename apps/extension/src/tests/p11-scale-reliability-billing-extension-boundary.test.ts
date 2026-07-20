import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P11 scale reliability billing extension boundary", () => {
  it("keeps reliability, usage metering, and billing internals out of the extension runtime", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "sloReadiness",
      "reliabilityInternals",
      "usageMeteringInternals",
      "billingReadiness",
      "paymentProvider",
      "quotaEnforcement",
      "rawUsageData",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawAuditMetadata",
      "accessToken",
      "refreshToken",
      "cookies",
      "authorizationHeader",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
