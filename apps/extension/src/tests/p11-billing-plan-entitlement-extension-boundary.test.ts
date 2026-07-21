import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P11 billing plan entitlement extension boundary", () => {
  it("keeps billing, plan, and entitlement internals out of the extension runtime", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "billingReadiness",
      "planCatalogReadiness",
      "entitlementReadiness",
      "subscriptionLifecycle",
      "paymentProvider",
      "paymentMethod",
      "rawUsageEvents",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawAuditMetadata",
      "rawCustomerMessage",
      "accessToken",
      "refreshToken",
      "authorizationHeader",
      "clientSecret",
      "chargeExecution",
      "invoiceCreation",
      "quotaEnforcement",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
