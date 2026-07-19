import { describe, expect, it } from "vitest";
import { validateAnalyticsMetricContract } from "../src/analytics/analytics-metric-contract";

describe("P9 analytics metric contract", () => {
  it("accepts known metric contract dimensions", () => {
    expect(
      validateAnalyticsMetricContract({
        metricKey: "conversation_total",
        category: "operational",
        valueType: "count",
        aggregationLevel: "workspace",
      }),
    ).toEqual({ valid: true });
  });

  it("rejects unknown metric contract dimensions", () => {
    expect(
      validateAnalyticsMetricContract({
        metricKey: "unknown_metric",
        category: "operational",
        valueType: "count",
        aggregationLevel: "workspace",
      }),
    ).toEqual({ valid: false, reasonCode: "unknown_metric_key" });

    expect(
      validateAnalyticsMetricContract({
        metricKey: "conversation_total",
        category: "raw_payload",
        valueType: "count",
        aggregationLevel: "workspace",
      }),
    ).toEqual({ valid: false, reasonCode: "unknown_metric_category" });
  });
});
