import type { AuthContext } from "../auth/auth-context";
import { ValidationError } from "../errors/app-error";
import { AnalyticsAuditService } from "./analytics-audit-service";
import type { AnalyticsAuditEventName } from "./analytics-audit-event-types";
import type {
  CoreOperationalCategory,
  CoreOperationalMetricsQuery,
} from "./analytics-operational-metric-types";
import { assertAnalyticsOperatorFilterAllowed } from "./analytics-operator-filter-policy";
import type { AnalyticsMetricCategory } from "./analytics-metric-types";
import { getAnalyticsPrivacyHardening } from "./analytics-privacy-hardening";
import { toAnalyticsReportingFilterSummary } from "./analytics-reporting-filter-dto";
import {
  assertAnalyticsReportingWorkspace,
  parseAnalyticsReportingFilters,
} from "./analytics-reporting-filter-policy";
import type { AnalyticsReportingFilters } from "./analytics-reporting-filter-types";
import type {
  CrmWorkflowCategory,
  CrmWorkflowMetricsQuery,
} from "./crm-workflow-metrics-types";
import type { KpiDashboardQuery } from "./kpi-dashboard-card-types";

export function prepareAnalyticsReporting(input: {
  auth: AuthContext;
  query: Record<string, unknown>;
  eventName: AnalyticsAuditEventName;
  allowedCategories?: AnalyticsMetricCategory[];
}) {
  const filters = parseAnalyticsReportingFilters(input.query);

  assertAnalyticsReportingWorkspace({
    filters,
    authWorkspaceId: input.auth.workspaceId,
  });
  if (filters.operatorId) {
    assertAnalyticsOperatorFilterAllowed({
      auth: input.auth,
      operatorId: filters.operatorId,
    });
  }

  if (
    filters.category &&
    input.allowedCategories &&
    !input.allowedCategories.includes(filters.category)
  ) {
    throw new ValidationError("Invalid analytics query.", [
      { path: "query.category", message: "Metric category mismatch." },
    ]);
  }

  const audit = new AnalyticsAuditService().record({
    eventName: input.eventName,
    auth: input.auth,
    filters,
  });

  return {
    filters,
    audit,
    privacy: getAnalyticsPrivacyHardening(),
    ...toAnalyticsReportingFilterSummary(filters),
  };
}

function isCoreOperationalCategory(
  category: AnalyticsMetricCategory,
): category is CoreOperationalCategory {
  return ["operational", "channel_performance", "sla_readiness"].includes(
    category,
  );
}

function isCrmWorkflowCategory(
  category: AnalyticsMetricCategory,
): category is CrmWorkflowCategory {
  return ["crm_workflow", "audit_compliance"].includes(category);
}

export function toCoreOperationalQuery(
  filters: AnalyticsReportingFilters,
): CoreOperationalMetricsQuery {
  const query: CoreOperationalMetricsQuery = {
    timeWindow: filters.timeWindow,
    channel: filters.channel,
  };

  if (filters.workspaceId) {
    query.workspaceId = filters.workspaceId;
  }

  if (filters.category && isCoreOperationalCategory(filters.category)) {
    query.category = filters.category;
  }

  return query;
}

export function toCrmWorkflowQuery(
  filters: AnalyticsReportingFilters,
): CrmWorkflowMetricsQuery {
  const query: CrmWorkflowMetricsQuery = {
    timeWindow: filters.timeWindow,
  };

  if (filters.workspaceId) {
    query.workspaceId = filters.workspaceId;
  }

  if (filters.category && isCrmWorkflowCategory(filters.category)) {
    query.category = filters.category;
  }

  return query;
}

export function toKpiDashboardQuery(
  filters: AnalyticsReportingFilters,
): KpiDashboardQuery {
  const query: KpiDashboardQuery = {
    timeWindow: filters.timeWindow,
  };

  if (filters.workspaceId) {
    query.workspaceId = filters.workspaceId;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  return query;
}
