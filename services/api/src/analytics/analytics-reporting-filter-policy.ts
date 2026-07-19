import { ValidationError } from "../errors/app-error";
import {
  isAllowedAnalyticsMetricCategory,
  isAllowedAnalyticsTimeWindow,
} from "./analytics-kpi-policy";
import { isSensitiveAnalyticsRequest } from "./analytics-sensitive-request-policy";
import type {
  AnalyticsReportingCategory,
  AnalyticsReportingChannel,
  AnalyticsReportingFilters,
  AnalyticsReportingTimeWindow,
} from "./analytics-reporting-filter-types";

const allowedKeys = new Set([
  "timeWindow",
  "channel",
  "category",
  "operatorId",
  "workspaceId",
]);
const allowedTimeWindows = ["today", "last_7_days", "last_30_days"] as const;
const allowedChannels = ["all", "email", "webchat", "whatsapp"] as const;
const allowedCategories = [
  "operational",
  "channel_performance",
  "sla_readiness",
  "crm_workflow",
  "audit_compliance",
] as const;

function firstQueryValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return firstQueryValue(value[0]);
  }

  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

export function parseAnalyticsReportingFilters(
  query: Record<string, unknown>,
): AnalyticsReportingFilters {
  const unknownKey = Object.keys(query).find((key) => !allowedKeys.has(key));

  if (unknownKey) {
    throw new ValidationError("Invalid analytics query.", [
      { path: `query.${unknownKey}`, message: "Unknown reporting filter." },
    ]);
  }

  if (isSensitiveAnalyticsRequest(query)) {
    throw new ValidationError("Invalid analytics query.", [
      { path: "query", message: "Unsafe analytics query." },
    ]);
  }

  const timeWindow = firstQueryValue(query.timeWindow) ?? "last_7_days";
  const channel = firstQueryValue(query.channel) ?? "all";
  const category = firstQueryValue(query.category);
  const operatorId = firstQueryValue(query.operatorId);
  const workspaceId = firstQueryValue(query.workspaceId);

  if (
    !isAllowedAnalyticsTimeWindow(timeWindow) ||
    !allowedTimeWindows.includes(timeWindow as AnalyticsReportingTimeWindow)
  ) {
    throw new ValidationError("Invalid analytics query.", [
      { path: "query.timeWindow", message: "Unknown time window." },
    ]);
  }

  if (!allowedChannels.includes(channel as AnalyticsReportingChannel)) {
    throw new ValidationError("Invalid analytics query.", [
      { path: "query.channel", message: "Unknown channel." },
    ]);
  }

  const parsed: AnalyticsReportingFilters = {
    timeWindow: timeWindow as AnalyticsReportingTimeWindow,
    channel: channel as AnalyticsReportingChannel,
  };

  if (category) {
    if (
      !isAllowedAnalyticsMetricCategory(category) ||
      !allowedCategories.includes(category as AnalyticsReportingCategory)
    ) {
      throw new ValidationError("Invalid analytics query.", [
        { path: "query.category", message: "Unknown metric category." },
      ]);
    }

    parsed.category = category as AnalyticsReportingCategory;
  }

  if (operatorId) {
    parsed.operatorId = operatorId;
  }

  if (workspaceId) {
    parsed.workspaceId = workspaceId;
  }

  return parsed;
}

export function assertAnalyticsReportingWorkspace(input: {
  filters: AnalyticsReportingFilters;
  authWorkspaceId: string;
}): void {
  if (
    input.filters.workspaceId &&
    input.filters.workspaceId !== input.authWorkspaceId
  ) {
    throw new ValidationError("Invalid analytics query.", [
      {
        path: "query.workspaceId",
        message: "Workspace scope must come from authenticated context.",
      },
    ]);
  }
}
