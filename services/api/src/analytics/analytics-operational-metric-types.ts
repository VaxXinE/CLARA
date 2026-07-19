import type {
  AnalyticsAggregationLevel,
  AnalyticsMetricCategory,
  AnalyticsMetricKey,
  AnalyticsTimeWindow,
  AnalyticsValueType,
} from "./analytics-metric-types";

export type CoreOperationalTimeWindow = Exclude<AnalyticsTimeWindow, "custom">;

export type CoreOperationalChannel = "all" | "email" | "webchat" | "whatsapp";

export type CoreOperationalCategory =
  "operational" | "channel_performance" | "sla_readiness";

export type CoreOperationalMetricsQuery = {
  timeWindow: CoreOperationalTimeWindow;
  channel: CoreOperationalChannel;
  category?: CoreOperationalCategory;
  workspaceId?: string;
};

export type CoreOperationalMetric = {
  metricKey: AnalyticsMetricKey;
  label: string;
  description: string;
  value: number | string;
  valueType: AnalyticsValueType;
  aggregationLevel: Extract<AnalyticsAggregationLevel, "workspace" | "channel">;
  implementationStatus: "implemented";
  privacy: {
    aggregated: true;
    rawPayloadIncluded: false;
    rawCustomerMessagesIncluded: false;
    workspaceScoped: true;
    piiMinimized: true;
    policyVersion: string;
  };
};

export type CoreOperationalMetricsResponse = {
  workspaceId: string;
  generatedAt: string;
  timeWindow: CoreOperationalTimeWindow;
  channel: CoreOperationalChannel;
  category: AnalyticsMetricCategory;
  metrics: CoreOperationalMetric[];
  safety: {
    readOnly: true;
    mutationAllowed: false;
    actionExecuted: false;
    crmMutationExecuted: false;
    taskCreated: false;
    outboundSent: false;
    customerLevelDrilldown: false;
    reportExported: false;
  };
};

export type AnalyticsOverviewResponse = {
  workspaceId: string;
  generatedAt: string;
  timeWindow: CoreOperationalTimeWindow;
  channel: CoreOperationalChannel;
  sections: {
    conversationVolume: CoreOperationalMetricsResponse;
    responseTimeSla: CoreOperationalMetricsResponse;
    channelPerformance: CoreOperationalMetricsResponse;
  };
  safety: CoreOperationalMetricsResponse["safety"];
};
