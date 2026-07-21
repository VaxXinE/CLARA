import { describe, expect, it } from "vitest";
import { buildPerformanceCapacitySafeSummary } from "../src/reliability/performance-capacity-safe-summary";

describe("P11 performance capacity safe summary", () => {
  it("excludes raw telemetry, payloads, and secrets", () => {
    expect(buildPerformanceCapacitySafeSummary()).toEqual({
      syntheticOnly: true,
      workspaceScoped: true,
      aggregateOnly: true,
      rawLogsIncluded: false,
      rawTracesIncluded: false,
      rawMetricEventsIncluded: false,
      rawCustomerMessagesIncluded: false,
      rawProviderPayloadIncluded: false,
      rawWebhookPayloadIncluded: false,
      secretsIncluded: false,
    });
  });
});
