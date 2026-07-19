import type { AnalyticsReportingFilters } from "./analytics-reporting-filter-types";

export function toAnalyticsReportingFilterSummary(
  filters: AnalyticsReportingFilters,
) {
  return {
    appliedFilters: {
      timeWindow: filters.timeWindow,
      channel: filters.channel,
      ...(filters.category ? { category: filters.category } : {}),
      operatorScoped: Boolean(filters.operatorId),
    },
    rejectedFilters: [],
    filterSafety: {
      workspaceScoped: true,
      clientWorkspaceIdIgnored: true,
      customerLevelDrilldown: false,
      reportExported: false,
      rawPayloadIncluded: false,
      rawCustomerMessagesIncluded: false,
    },
  } as const;
}
