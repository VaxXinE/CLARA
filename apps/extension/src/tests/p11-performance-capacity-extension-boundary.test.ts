import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P11 performance capacity extension boundary", () => {
  it("keeps performance internals and raw telemetry out of the extension runtime", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "performanceReadiness",
      "loadTestReadiness",
      "capacityPlanning",
      "safeBenchmarkSummary",
      "rawTelemetry",
      "rawLogs",
      "rawTraces",
      "rawMetricEvents",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawCustomerMessage",
      "accessToken",
      "refreshToken",
      "authorizationHeader",
      "clientSecret",
      "runLoadTest",
      "runBenchmark",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
