import { describe, expect, it } from "vitest";
import { buildBillingSafeMetadataBoundary } from "../src/billing/billing-safe-metadata-boundary";

describe("P11 billing safe metadata boundary", () => {
  it("allows only safe aggregate metadata and no payment credentials", () => {
    expect(buildBillingSafeMetadataBoundary()).toEqual({
      providerNamesAllowed: true,
      planCodeAllowed: true,
      workspaceIdAllowed: true,
      aggregateCountersAllowed: true,
      rawUsageEventsAllowed: false,
      rawCustomerMessagesAllowed: false,
      rawProviderPayloadAllowed: false,
      rawWebhookPayloadAllowed: false,
      paymentCredentialsAllowed: false,
    });
  });
});
