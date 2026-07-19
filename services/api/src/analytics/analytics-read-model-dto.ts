import { analyticsMetricCategories } from "./analytics-metric-types";
import { analyticsPrivacyDefaults } from "./analytics-privacy-policy";
import type {
  AnalyticsMetricCatalogItem,
  AnalyticsReadinessResponse,
} from "./analytics-read-model-types";

export function buildAnalyticsReadinessResponse(input: {
  workspaceId: string;
  generatedAt: string;
}): AnalyticsReadinessResponse {
  return {
    workspaceId: input.workspaceId,
    generatedAt: input.generatedAt,
    phase: "p9",
    readiness: {
      analyticsFoundationReady: true,
      metricRegistryReady: true,
      metricContractReady: true,
      runtimeMetricsImplemented: false,
      scheduledAggregationImplemented: false,
      reportExportImplemented: false,
    },
    allowedCategories: [...analyticsMetricCategories],
    blockedCategories: ["raw_payload", "secrets", "cross_workspace"],
    privacy: {
      workspaceScoped: true,
      aggregateFirst: true,
      rawPayloadIncluded: false,
      rawCustomerMessagesIncluded: false,
      piiMinimized: true,
      policyVersion: analyticsPrivacyDefaults.policyVersion,
    },
    safety: {
      readOnly: true,
      mutationAllowed: false,
      actionExecuted: false,
      crmMutationExecuted: false,
      taskCreated: false,
      outboundSent: false,
    },
  };
}

export function withAnalyticsMetricPrivacy(
  metric: Omit<AnalyticsMetricCatalogItem, "privacy">,
): AnalyticsMetricCatalogItem {
  return {
    ...metric,
    privacy: {
      aggregated: true,
      rawPayloadIncluded: false,
      rawCustomerMessagesIncluded: false,
      workspaceScoped: true,
      piiMinimized: true,
    },
  };
}
