import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P11 rate limit quota usage metering extension boundary", () => {
  it("keeps usage, quota, and billing internals out of the extension runtime", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "usageMetering",
      "usageEvents",
      "billingMetadata",
      "quotaReadiness",
      "rateLimitPolicy",
      "subscriptionMutation",
      "planMutation",
      "entitlementMutation",
      "invoiceCreation",
      "customerCharging",
      "paymentProvider",
      "rawUsageEvent",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawAuditMetadata",
      "rawCustomerMessage",
      "accessToken",
      "refreshToken",
      "authorizationHeader",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
