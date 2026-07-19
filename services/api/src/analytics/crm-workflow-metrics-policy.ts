import { ValidationError } from "../errors/app-error";
import {
  isAllowedAnalyticsMetricCategory,
  isAllowedAnalyticsTimeWindow,
} from "./analytics-kpi-policy";
import { containsUnsafeAnalyticsRequest } from "./analytics-privacy-policy";
import type {
  CrmWorkflowCategory,
  CrmWorkflowMetricsQuery,
  CrmWorkflowTimeWindow,
} from "./crm-workflow-metrics-types";

const allowedTimeWindows = ["today", "last_7_days", "last_30_days"] as const;
const allowedCategories = ["crm_workflow", "audit_compliance"] as const;

function firstQueryValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return firstQueryValue(value[0]);
  }

  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

export function isAllowedCrmWorkflowTimeWindow(
  value: string,
): value is CrmWorkflowTimeWindow {
  return (
    isAllowedAnalyticsTimeWindow(value) &&
    allowedTimeWindows.includes(value as CrmWorkflowTimeWindow)
  );
}

export function isAllowedCrmWorkflowCategory(
  value: string,
): value is CrmWorkflowCategory {
  return (
    isAllowedAnalyticsMetricCategory(value) &&
    allowedCategories.includes(value as CrmWorkflowCategory)
  );
}

export function parseCrmWorkflowMetricsQuery(
  query: Record<string, unknown>,
): CrmWorkflowMetricsQuery {
  const timeWindow = firstQueryValue(query.timeWindow) ?? "last_7_days";
  const category = firstQueryValue(query.category);
  const workspaceId = firstQueryValue(query.workspaceId);

  if (!isAllowedCrmWorkflowTimeWindow(timeWindow)) {
    throw new ValidationError("Invalid analytics query.", [
      { path: "query.timeWindow", message: "Unknown time window." },
    ]);
  }

  const parsed: CrmWorkflowMetricsQuery = { timeWindow };

  if (category) {
    if (!isAllowedCrmWorkflowCategory(category)) {
      throw new ValidationError("Invalid analytics query.", [
        { path: "query.category", message: "Unknown metric category." },
      ]);
    }

    parsed.category = category;
  }

  if (workspaceId) {
    parsed.workspaceId = workspaceId;
  }

  return parsed;
}

export function assertSafeCrmWorkflowMetricsQuery(input: {
  query: CrmWorkflowMetricsQuery;
  authWorkspaceId: string;
}): void {
  if (
    input.query.workspaceId &&
    input.query.workspaceId !== input.authWorkspaceId
  ) {
    throw new ValidationError("Invalid analytics query.", [
      {
        path: "query.workspaceId",
        message: "Workspace scope must come from authenticated context.",
      },
    ]);
  }

  if (containsUnsafeAnalyticsRequest(input.query)) {
    throw new ValidationError("Invalid analytics query.", [
      { path: "query", message: "Unsafe analytics query." },
    ]);
  }
}
