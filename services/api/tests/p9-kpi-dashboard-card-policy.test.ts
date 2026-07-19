import { describe, expect, it } from "vitest";
import { ValidationError } from "../src/errors/app-error";
import {
  assertSafeKpiDashboardQuery,
  parseKpiDashboardQuery,
} from "../src/analytics/kpi-dashboard-card-policy";

describe("P9 KPI dashboard card policy", () => {
  it("allows only compact P9 dashboard query parameters", () => {
    expect(
      parseKpiDashboardQuery({
        timeWindow: "today",
        category: "channel_performance",
      }),
    ).toEqual({
      timeWindow: "today",
      category: "channel_performance",
    });

    expect(() => parseKpiDashboardQuery({ timeWindow: "custom" })).toThrow(
      ValidationError,
    );
    expect(() =>
      parseKpiDashboardQuery({ category: "operator_productivity" }),
    ).toThrow(ValidationError);
  });

  it("blocks workspace spoofing and unsafe dashboard requests", () => {
    expect(() =>
      assertSafeKpiDashboardQuery({
        authWorkspaceId: "wks_demo_sales",
        query: {
          timeWindow: "last_7_days",
          workspaceId: "wks_other",
        },
      }),
    ).toThrow(ValidationError);

    expect(() =>
      assertSafeKpiDashboardQuery({
        authWorkspaceId: "wks_demo_sales",
        query: {
          timeWindow: "last_7_days",
          workspaceId: "raw customer message",
        },
      }),
    ).toThrow(ValidationError);
  });
});
