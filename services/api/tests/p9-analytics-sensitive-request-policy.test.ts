import { describe, expect, it } from "vitest";
import {
  findSensitiveAnalyticsRequestTerm,
  isSensitiveAnalyticsRequest,
} from "../src/analytics/analytics-sensitive-request-policy";

describe("P9 analytics sensitive request policy", () => {
  it("blocks sensitive metric request terms", () => {
    for (const value of [
      { metric: "access_token" },
      { metric: "refresh_token" },
      { metric: "rawProviderPayload" },
      { metric: "raw_webhook_payload" },
      { metric: "rawAuditMetadata" },
      { metric: "raw_customer_message" },
      { metric: "customerMessageBody" },
      { metric: "Authorization" },
      { metric: "api key" },
      { metric: "rawHtml" },
      { metric: "rawPrompt" },
    ]) {
      expect(isSensitiveAnalyticsRequest(value)).toBe(true);
      expect(findSensitiveAnalyticsRequestTerm(value)).not.toBeNull();
    }
  });

  it("allows safe aggregate filter terms", () => {
    expect(
      isSensitiveAnalyticsRequest({
        timeWindow: "last_7_days",
        channel: "email",
        category: "operational",
      }),
    ).toBe(false);
  });
});
