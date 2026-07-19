import { ValidationError } from "../errors/app-error";
import {
  isAllowedAnalyticsMetricCategory,
  isAllowedAnalyticsTimeWindow,
} from "./analytics-kpi-policy";
import { containsUnsafeAnalyticsRequest } from "./analytics-privacy-policy";
import type {
  KpiDashboardCategory,
  KpiDashboardQuery,
  KpiDashboardTimeWindow,
} from "./kpi-dashboard-card-types";

const allowedTimeWindows = ["today", "last_7_days", "last_30_days"] as const;
const allowedCategories = [
  "crm_workflow",
  "audit_compliance",
  "operational",
  "channel_performance",
  "sla_readiness",
] as const;

function firstQueryValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return firstQueryValue(value[0]);
  }

  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

export function isAllowedKpiDashboardTimeWindow(
  value: string,
): value is KpiDashboardTimeWindow {
  return (
    isAllowedAnalyticsTimeWindow(value) &&
    allowedTimeWindows.includes(value as KpiDashboardTimeWindow)
  );
}

export function isAllowedKpiDashboardCategory(
  value: string,
): value is KpiDashboardCategory {
  return (
    isAllowedAnalyticsMetricCategory(value) &&
    allowedCategories.includes(value as KpiDashboardCategory)
  );
}

export function parseKpiDashboardQuery(
  query: Record<string, unknown>,
): KpiDashboardQuery {
  const timeWindow = firstQueryValue(query.timeWindow) ?? "last_7_days";
  const category = firstQueryValue(query.category);
  const workspaceId = firstQueryValue(query.workspaceId);

  if (!isAllowedKpiDashboardTimeWindow(timeWindow)) {
    throw new ValidationError("Invalid analytics query.", [
      { path: "query.timeWindow", message: "Unknown time window." },
    ]);
  }

  const parsed: KpiDashboardQuery = { timeWindow };

  if (category) {
    if (!isAllowedKpiDashboardCategory(category)) {
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

export function assertSafeKpiDashboardQuery(input: {
  query: KpiDashboardQuery;
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
