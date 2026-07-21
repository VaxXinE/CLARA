import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P11 observability SLO alert extension boundary", () => {
  it("keeps telemetry and alert internals out of the extension runtime", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "observabilityReadiness",
      "sloDashboard",
      "alertReadiness",
      "safeTelemetrySummary",
      "rawLogs",
      "rawTraces",
      "rawMetricEvents",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawAuditMetadata",
      "rawCustomerMessage",
      "accessToken",
      "refreshToken",
      "authorizationHeader",
      "clientSecret",
      "notificationProvider",
      "alertExecution",
      "telemetryExport",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
