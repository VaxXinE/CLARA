import { describe, expect, it } from "vitest";
import { buildSafeBillingSummary } from "../src/billing/billing-readiness-safe-summary";

describe("P11 billing readiness safe summary", () => {
  it("returns aggregate-first billing metadata without sensitive payloads", () => {
    expect(buildSafeBillingSummary()).toEqual({
      aggregateOnly: true,
      workspaceScoped: true,
      rawUsageEventsIncluded: false,
      rawCustomerMessagesIncluded: false,
      rawProviderPayloadIncluded: false,
      rawWebhookPayloadIncluded: false,
      paymentDataIncluded: false,
      secretsIncluded: false,
    });
  });
});
