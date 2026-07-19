import { describe, expect, it } from "vitest";
import { ValidationError } from "../src/errors/app-error";
import {
  assertSafeCrmWorkflowMetricsQuery,
  parseCrmWorkflowMetricsQuery,
} from "../src/analytics/crm-workflow-metrics-policy";

describe("P9 CRM workflow metrics policy", () => {
  it("allows only compact P9 CRM workflow query parameters", () => {
    expect(
      parseCrmWorkflowMetricsQuery({
        timeWindow: "last_30_days",
        category: "crm_workflow",
      }),
    ).toEqual({
      timeWindow: "last_30_days",
      category: "crm_workflow",
    });

    expect(() =>
      parseCrmWorkflowMetricsQuery({ timeWindow: "custom" }),
    ).toThrow(ValidationError);
    expect(() =>
      parseCrmWorkflowMetricsQuery({ category: "operator_productivity" }),
    ).toThrow(ValidationError);
  });

  it("blocks workspace spoofing and unsafe analytics requests", () => {
    expect(() =>
      assertSafeCrmWorkflowMetricsQuery({
        authWorkspaceId: "wks_demo_sales",
        query: {
          timeWindow: "last_7_days",
          workspaceId: "wks_other",
        },
      }),
    ).toThrow(ValidationError);

    expect(() =>
      assertSafeCrmWorkflowMetricsQuery({
        authWorkspaceId: "wks_demo_sales",
        query: {
          timeWindow: "last_7_days",
          workspaceId: "raw provider payload",
        },
      }),
    ).toThrow(ValidationError);
  });
});
