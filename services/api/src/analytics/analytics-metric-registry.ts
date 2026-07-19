import {
  analyticsMetricCategories,
  analyticsMetricContracts,
  type AnalyticsMetricCategory,
  type AnalyticsMetricKey,
} from "./analytics-metric-types";
import { withAnalyticsMetricPrivacy } from "./analytics-read-model-dto";
import type { AnalyticsMetricCatalogItem } from "./analytics-read-model-types";

export function listAnalyticsMetricCategories(): AnalyticsMetricCategory[] {
  return [...analyticsMetricCategories];
}

export function listAnalyticsMetricKeys(): AnalyticsMetricKey[] {
  return Object.keys(analyticsMetricContracts) as AnalyticsMetricKey[];
}

export function listAnalyticsMetricCatalog(): AnalyticsMetricCatalogItem[] {
  return listAnalyticsMetricKeys().map((metricKey) => {
    const contract = analyticsMetricContracts[metricKey];

    return withAnalyticsMetricPrivacy({
      metricKey,
      category: contract.category,
      label: contract.label,
      description: contract.description,
      valueType: contract.valueType,
      aggregationLevel: contract.aggregationLevel,
      implementationStatus: "foundation_ready",
    });
  });
}
