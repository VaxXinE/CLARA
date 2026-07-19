import type {
  AnalyticsMetricCategory,
  AnalyticsTimeWindow,
} from "./analytics-metric-types";

export type AnalyticsReportingTimeWindow = Exclude<
  AnalyticsTimeWindow,
  "custom"
>;

export type AnalyticsReportingChannel =
  "all" | "email" | "webchat" | "whatsapp";

export type AnalyticsReportingCategory = Extract<
  AnalyticsMetricCategory,
  | "operational"
  | "channel_performance"
  | "sla_readiness"
  | "crm_workflow"
  | "audit_compliance"
>;

export type AnalyticsReportingFilters = {
  timeWindow: AnalyticsReportingTimeWindow;
  channel: AnalyticsReportingChannel;
  category?: AnalyticsReportingCategory;
  operatorId?: string;
  workspaceId?: string;
};

export type AnalyticsReportingFilterSummary = {
  appliedFilters: {
    timeWindow: AnalyticsReportingTimeWindow;
    channel: AnalyticsReportingChannel;
    category?: AnalyticsReportingCategory;
    operatorScoped: boolean;
  };
  rejectedFilters: Array<{
    key: string;
    reasonCode: string;
  }>;
  filterSafety: {
    workspaceScoped: true;
    clientWorkspaceIdIgnored: true;
    customerLevelDrilldown: false;
    reportExported: false;
    rawPayloadIncluded: false;
    rawCustomerMessagesIncluded: false;
  };
};
