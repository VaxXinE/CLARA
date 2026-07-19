import type { AnalyticsReportingFilters } from "./analytics-reporting-filter-types";

export function toSafeFilterSummary(filters: AnalyticsReportingFilters) {
  return {
    timeWindow: filters.timeWindow,
    channel: filters.channel,
    category: filters.category ?? "all",
    operatorScoped: Boolean(filters.operatorId),
  };
}
