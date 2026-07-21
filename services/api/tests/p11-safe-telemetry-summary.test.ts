import { describe, expect, it } from "vitest";
import { buildSafeTelemetrySummary } from "../src/reliability/safe-telemetry-summary";

describe("P11 safe telemetry summary", () => {
  it("returns aggregate-only telemetry readiness without raw data or secrets", () => {
    expect(buildSafeTelemetrySummary()).toEqual({
      aggregateOnly: true,
      workspaceScoped: true,
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
