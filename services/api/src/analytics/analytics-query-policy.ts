import { ValidationError } from "../errors/app-error";
import {
  isAllowedAnalyticsAggregationLevel,
  isAllowedAnalyticsMetricCategory,
  isAllowedAnalyticsMetricKey,
  isAllowedAnalyticsValueType,
} from "./analytics-kpi-policy";
import { containsUnsafeAnalyticsRequest } from "./analytics-privacy-policy";

export type AnalyticsMetricCatalogQuery = {
  metricKey?: string;
  category?: string;
  valueType?: string;
  aggregationLevel?: string;
  workspaceId?: string;
};

function firstQueryValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return firstQueryValue(value[0]);
  }

  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

export function parseAnalyticsMetricCatalogQuery(
  query: Record<string, unknown>,
): AnalyticsMetricCatalogQuery {
  const parsed: AnalyticsMetricCatalogQuery = {};
  const metricKey = firstQueryValue(query.metricKey);
  const category = firstQueryValue(query.category);
  const valueType = firstQueryValue(query.valueType);
  const aggregationLevel = firstQueryValue(query.aggregationLevel);
  const workspaceId = firstQueryValue(query.workspaceId);

  if (metricKey) {
    parsed.metricKey = metricKey;
  }

  if (category) {
    parsed.category = category;
  }

  if (valueType) {
    parsed.valueType = valueType;
  }

  if (aggregationLevel) {
    parsed.aggregationLevel = aggregationLevel;
  }

  if (workspaceId) {
    parsed.workspaceId = workspaceId;
  }

  return parsed;
}

export function assertSafeAnalyticsMetricCatalogQuery(input: {
  query: AnalyticsMetricCatalogQuery;
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

  if (
    input.query.metricKey &&
    !isAllowedAnalyticsMetricKey(input.query.metricKey)
  ) {
    throw new ValidationError("Invalid analytics query.", [
      { path: "query.metricKey", message: "Unknown metric key." },
    ]);
  }

  if (
    input.query.category &&
    !isAllowedAnalyticsMetricCategory(input.query.category)
  ) {
    throw new ValidationError("Invalid analytics query.", [
      { path: "query.category", message: "Unknown metric category." },
    ]);
  }

  if (
    input.query.valueType &&
    !isAllowedAnalyticsValueType(input.query.valueType)
  ) {
    throw new ValidationError("Invalid analytics query.", [
      { path: "query.valueType", message: "Unknown metric value type." },
    ]);
  }

  if (
    input.query.aggregationLevel &&
    !isAllowedAnalyticsAggregationLevel(input.query.aggregationLevel)
  ) {
    throw new ValidationError("Invalid analytics query.", [
      {
        path: "query.aggregationLevel",
        message: "Unknown metric aggregation level.",
      },
    ]);
  }

  if (containsUnsafeAnalyticsRequest(input.query)) {
    throw new ValidationError("Invalid analytics query.", [
      { path: "query", message: "Unsafe analytics query." },
    ]);
  }
}
