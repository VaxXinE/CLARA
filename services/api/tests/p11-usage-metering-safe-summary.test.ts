import { describe, expect, it } from "vitest";
import { buildUsageMeteringSafeSummary } from "../src/billing/usage-metering-safe-summary";

describe("P11 usage metering safe summary", () => {
  it("does not include raw usage, customer, provider, or webhook payloads", () => {
    expect(buildUsageMeteringSafeSummary()).toEqual({
      aggregateOnly: true,
      workspaceScoped: true,
      rawUsageEventsIncluded: false,
      rawCustomerMessagesIncluded: false,
      rawProviderPayloadIncluded: false,
      rawWebhookPayloadIncluded: false,
      safeBillingMetadataOnly: true,
    });
  });
});
