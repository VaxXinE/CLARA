import {
  isAllowedAnalyticsAggregationLevel,
  isAllowedAnalyticsMetricCategory,
  isAllowedAnalyticsMetricKey,
  isAllowedAnalyticsValueType,
} from "./analytics-kpi-policy";

export type AnalyticsMetricContractValidation =
  { valid: true } | { valid: false; reasonCode: string };

export function validateAnalyticsMetricContract(input: {
  metricKey: string;
  category: string;
  valueType: string;
  aggregationLevel: string;
}): AnalyticsMetricContractValidation {
  if (!isAllowedAnalyticsMetricKey(input.metricKey)) {
    return { valid: false, reasonCode: "unknown_metric_key" };
  }

  if (!isAllowedAnalyticsMetricCategory(input.category)) {
    return { valid: false, reasonCode: "unknown_metric_category" };
  }

  if (!isAllowedAnalyticsValueType(input.valueType)) {
    return { valid: false, reasonCode: "unknown_value_type" };
  }

  if (!isAllowedAnalyticsAggregationLevel(input.aggregationLevel)) {
    return { valid: false, reasonCode: "unknown_aggregation_level" };
  }

  return { valid: true };
}
