import { describe, expect, it } from "vitest";
import {
  getAnalyticsMetricContract,
  isAllowedAnalyticsAggregationLevel,
  isAllowedAnalyticsMetricCategory,
  isAllowedAnalyticsMetricKey,
  isAllowedAnalyticsTimeWindow,
  isAllowedAnalyticsValueType,
} from "../src/analytics/analytics-kpi-policy";

describe("P9 analytics KPI policy", () => {
  it("allows only known metric keys and categories", () => {
    expect(isAllowedAnalyticsMetricKey("conversation_total")).toBe(true);
    expect(isAllowedAnalyticsMetricKey("raw_customer_message_export")).toBe(
      false,
    );

    expect(isAllowedAnalyticsMetricCategory("operational")).toBe(true);
    expect(isAllowedAnalyticsMetricCategory("secrets")).toBe(false);
  });

  it("defines safe metric output contract dimensions", () => {
    expect(isAllowedAnalyticsValueType("count")).toBe(true);
    expect(isAllowedAnalyticsValueType("duration_ms")).toBe(true);
    expect(isAllowedAnalyticsValueType("raw_payload")).toBe(false);

    expect(isAllowedAnalyticsAggregationLevel("workspace")).toBe(true);
    expect(isAllowedAnalyticsAggregationLevel("customer")).toBe(false);

    expect(isAllowedAnalyticsTimeWindow("last_30_days")).toBe(true);
    expect(isAllowedAnalyticsTimeWindow("forever")).toBe(false);
  });

  it("maps required KPI categories to allowlisted contracts", () => {
    expect(getAnalyticsMetricContract("conversation_by_channel")).toMatchObject(
      {
        category: "channel_performance",
        valueType: "count",
      },
    );
    expect(
      getAnalyticsMetricContract("crm_audit_coverage_count"),
    ).toMatchObject({
      category: "audit_compliance",
      valueType: "count",
    });
    expect(getAnalyticsMetricContract("sla_risk_count")).toMatchObject({
      category: "sla_readiness",
      valueType: "count",
    });
  });
});
