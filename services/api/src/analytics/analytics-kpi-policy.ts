import {
  analyticsAggregationLevels,
  analyticsMetricCategories,
  analyticsMetricContracts,
  analyticsTimeWindows,
  analyticsValueTypes,
  type AnalyticsAggregationLevel,
  type AnalyticsMetricCategory,
  type AnalyticsMetricKey,
  type AnalyticsTimeWindow,
  type AnalyticsValueType,
} from "./analytics-metric-types";

export function isAllowedAnalyticsMetricKey(
  value: string,
): value is AnalyticsMetricKey {
  return value in analyticsMetricContracts;
}

export function isAllowedAnalyticsMetricCategory(
  value: string,
): value is AnalyticsMetricCategory {
  return analyticsMetricCategories.includes(value as AnalyticsMetricCategory);
}

export function isAllowedAnalyticsValueType(
  value: string,
): value is AnalyticsValueType {
  return analyticsValueTypes.includes(value as AnalyticsValueType);
}

export function isAllowedAnalyticsAggregationLevel(
  value: string,
): value is AnalyticsAggregationLevel {
  return analyticsAggregationLevels.includes(
    value as AnalyticsAggregationLevel,
  );
}

export function isAllowedAnalyticsTimeWindow(
  value: string,
): value is AnalyticsTimeWindow {
  return analyticsTimeWindows.includes(value as AnalyticsTimeWindow);
}

export function getAnalyticsMetricContract(metricKey: AnalyticsMetricKey) {
  return analyticsMetricContracts[metricKey];
}
