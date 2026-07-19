import { describe, expect, it } from "vitest";
import {
  getAnalyticsPrivacyHardening,
  getAnalyticsReadOnlySafety,
} from "../src/analytics/analytics-privacy-hardening";

describe("P9 analytics privacy hardening", () => {
  it("returns aggregate privacy and read-only safety defaults", () => {
    expect(getAnalyticsPrivacyHardening()).toMatchObject({
      aggregated: true,
      workspaceScoped: true,
      rawPayloadIncluded: false,
      rawCustomerMessagesIncluded: false,
      rawProviderPayloadIncluded: false,
      rawWebhookPayloadIncluded: false,
      rawAuditMetadataIncluded: false,
      piiMinimized: true,
    });
    expect(getAnalyticsReadOnlySafety(true)).toMatchObject({
      readOnly: true,
      auditEventWritten: true,
      mutationAllowed: false,
      taskCreated: false,
      outboundSent: false,
    });
  });
});
