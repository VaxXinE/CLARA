import { describe, expect, it } from "vitest";
import {
  assertSafeAnalyticsMetricCatalogQuery,
  parseAnalyticsMetricCatalogQuery,
} from "../src/analytics/analytics-query-policy";
import { ValidationError } from "../src/errors/app-error";

describe("P9 analytics query policy", () => {
  it("parses supported metric catalog filters", () => {
    expect(
      parseAnalyticsMetricCatalogQuery({
        metricKey: "conversation_total",
        category: "operational",
        valueType: "count",
        aggregationLevel: "workspace",
      }),
    ).toEqual({
      metricKey: "conversation_total",
      category: "operational",
      valueType: "count",
      aggregationLevel: "workspace",
    });
  });

  it("blocks cross-workspace and unsafe analytics query requests", () => {
    expect(() =>
      assertSafeAnalyticsMetricCatalogQuery({
        authWorkspaceId: "wks_auth",
        query: { workspaceId: "wks_other" },
      }),
    ).toThrow(ValidationError);

    expect(() =>
      assertSafeAnalyticsMetricCatalogQuery({
        authWorkspaceId: "wks_auth",
        query: { metricKey: "raw_customer_message_export" },
      }),
    ).toThrow(ValidationError);
  });
});
