import { describe, expect, it } from "vitest";
import { ValidationError } from "../src/errors/app-error";
import {
  assertSafeCoreOperationalMetricsQuery,
  parseCoreOperationalMetricsQuery,
} from "../src/analytics/core-operational-metrics-policy";

describe("P9 core operational metrics policy", () => {
  it("allows only supported time windows, channels, and categories", () => {
    expect(
      parseCoreOperationalMetricsQuery({
        timeWindow: "last_30_days",
        channel: "webchat",
        category: "operational",
      }),
    ).toEqual({
      timeWindow: "last_30_days",
      channel: "webchat",
      category: "operational",
    });

    expect(() =>
      parseCoreOperationalMetricsQuery({ timeWindow: "custom" }),
    ).toThrow(ValidationError);
    expect(() =>
      parseCoreOperationalMetricsQuery({ channel: "instagram" }),
    ).toThrow(ValidationError);
    expect(() =>
      parseCoreOperationalMetricsQuery({ category: "crm_workflow" }),
    ).toThrow(ValidationError);
  });

  it("blocks workspace spoofing and unsafe analytics requests", () => {
    expect(() =>
      assertSafeCoreOperationalMetricsQuery({
        authWorkspaceId: "wks_demo_sales",
        query: {
          timeWindow: "last_7_days",
          channel: "all",
          workspaceId: "wks_other",
        },
      }),
    ).toThrow(ValidationError);

    expect(() =>
      assertSafeCoreOperationalMetricsQuery({
        authWorkspaceId: "wks_demo_sales",
        query: {
          timeWindow: "last_7_days",
          channel: "all",
          workspaceId: "raw provider payload",
        },
      }),
    ).toThrow(ValidationError);
  });
});
