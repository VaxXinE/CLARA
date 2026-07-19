import { ValidationError } from "../errors/app-error";
import {
  isAllowedAnalyticsMetricCategory,
  isAllowedAnalyticsTimeWindow,
} from "./analytics-kpi-policy";
import { containsUnsafeAnalyticsRequest } from "./analytics-privacy-policy";
import type {
  CoreOperationalCategory,
  CoreOperationalChannel,
  CoreOperationalMetricsQuery,
  CoreOperationalTimeWindow,
} from "./analytics-operational-metric-types";

const allowedTimeWindows = ["today", "last_7_days", "last_30_days"] as const;
const allowedChannels = ["all", "email", "webchat", "whatsapp"] as const;
const allowedCategories = [
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

export function isAllowedCoreOperationalTimeWindow(
  value: string,
): value is CoreOperationalTimeWindow {
  return (
    isAllowedAnalyticsTimeWindow(value) &&
    allowedTimeWindows.includes(value as CoreOperationalTimeWindow)
  );
}

export function isAllowedCoreOperationalChannel(
  value: string,
): value is CoreOperationalChannel {
  return allowedChannels.includes(value as CoreOperationalChannel);
}

export function isAllowedCoreOperationalCategory(
  value: string,
): value is CoreOperationalCategory {
  return (
    isAllowedAnalyticsMetricCategory(value) &&
    allowedCategories.includes(value as CoreOperationalCategory)
  );
}

export function parseCoreOperationalMetricsQuery(
  query: Record<string, unknown>,
): CoreOperationalMetricsQuery {
  const timeWindow = firstQueryValue(query.timeWindow) ?? "last_7_days";
  const channel = firstQueryValue(query.channel) ?? "all";
  const categoryValue = firstQueryValue(query.category);
  const workspaceId = firstQueryValue(query.workspaceId);

  if (!isAllowedCoreOperationalTimeWindow(timeWindow)) {
    throw new ValidationError("Invalid analytics query.", [
      { path: "query.timeWindow", message: "Unknown time window." },
    ]);
  }

  if (!isAllowedCoreOperationalChannel(channel)) {
    throw new ValidationError("Invalid analytics query.", [
      { path: "query.channel", message: "Unknown channel." },
    ]);
  }

  const parsed: CoreOperationalMetricsQuery = { timeWindow, channel };

  if (categoryValue) {
    if (!isAllowedCoreOperationalCategory(categoryValue)) {
      throw new ValidationError("Invalid analytics query.", [
        { path: "query.category", message: "Unknown metric category." },
      ]);
    }

    parsed.category = categoryValue;
  }

  if (workspaceId) {
    parsed.workspaceId = workspaceId;
  }

  return parsed;
}

export function assertSafeCoreOperationalMetricsQuery(input: {
  query: CoreOperationalMetricsQuery;
  authWorkspaceId: string;
  expectedCategory?: CoreOperationalCategory;
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

  if (
    input.expectedCategory &&
    input.query.category &&
    input.query.category !== input.expectedCategory
  ) {
    throw new ValidationError("Invalid analytics query.", [
      { path: "query.category", message: "Metric category mismatch." },
    ]);
  }

  if (containsUnsafeAnalyticsRequest(input.query)) {
    throw new ValidationError("Invalid analytics query.", [
      { path: "query", message: "Unsafe analytics query." },
    ]);
  }
}
