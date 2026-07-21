import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P11 final extension security regression", () => {
  it("does not expose token, telemetry, or provider payload fields", () => {
    for (const key of [
      "accessToken",
      "refreshToken",
      "authorizationHeader",
      "clientSecret",
      "cookies",
      "rawTelemetry",
      "rawLogs",
      "rawTraces",
      "rawMetricEvents",
      "rawUsageEvents",
      "rawPaymentData",
      "rawCustomerMessages",
      "rawProviderPayload",
      "rawWebhookPayload",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
