import { describe, expect, it } from "vitest";
import { ValidationError } from "../src/errors/app-error";
import {
  assertAnalyticsReportingWorkspace,
  parseAnalyticsReportingFilters,
} from "../src/analytics/analytics-reporting-filter-policy";

describe("P9 reporting filter policy", () => {
  it("allows compact aggregate reporting filters only", () => {
    expect(
      parseAnalyticsReportingFilters({
        timeWindow: "last_30_days",
        channel: "email",
        category: "operational",
        operatorId: "usr_demo_agent",
      }),
    ).toEqual({
      timeWindow: "last_30_days",
      channel: "email",
      category: "operational",
      operatorId: "usr_demo_agent",
    });

    expect(() =>
      parseAnalyticsReportingFilters({ dateFrom: "2026-01-01" }),
    ).toThrow(ValidationError);
    expect(() =>
      parseAnalyticsReportingFilters({ timeWindow: "custom" }),
    ).toThrow(ValidationError);
    expect(() =>
      parseAnalyticsReportingFilters({ channel: "instagram" }),
    ).toThrow(ValidationError);
    expect(() =>
      parseAnalyticsReportingFilters({ category: "operator_productivity" }),
    ).toThrow(ValidationError);
  });

  it("blocks workspace spoofing", () => {
    expect(() =>
      assertAnalyticsReportingWorkspace({
        authWorkspaceId: "wks_demo_sales",
        filters: {
          timeWindow: "last_7_days",
          channel: "all",
          workspaceId: "wks_other",
        },
      }),
    ).toThrow(ValidationError);
  });
});
