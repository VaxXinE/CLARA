import type {
  CrmWorkflowMetricsResponse,
  KpiDashboardResponse,
} from "../api/types";
import { AnalyticsAuditPrivacyPanel } from "./AnalyticsAuditPrivacyPanel";
import { AnalyticsReportingFiltersPanel } from "./AnalyticsReportingFiltersPanel";
import { CrmWorkflowMetricsPanel } from "./CrmWorkflowMetricsPanel";
import { KpiDashboardCardsPanel } from "./KpiDashboardCardsPanel";

type AnalyticsDashboardWorkspaceProps = {
  kpiDashboard: KpiDashboardResponse | null;
  crmWorkflowMetrics: CrmWorkflowMetricsResponse | null;
  loading?: boolean;
  error?: string | null;
};

export function AnalyticsDashboardWorkspace(
  props: AnalyticsDashboardWorkspaceProps,
) {
  return (
    <main aria-label="Analytics Dashboard Workspace">
      <AnalyticsReportingFiltersPanel
        filters={
          props.kpiDashboard?.appliedFilters && props.kpiDashboard.filterSafety
            ? {
                appliedFilters: props.kpiDashboard.appliedFilters,
                rejectedFilters: props.kpiDashboard.rejectedFilters ?? [],
                filterSafety: props.kpiDashboard.filterSafety,
              }
            : null
        }
      />
      <AnalyticsAuditPrivacyPanel audit={props.kpiDashboard?.audit ?? null} />
      <KpiDashboardCardsPanel
        dashboard={props.kpiDashboard}
        loading={props.loading}
        error={props.error}
      />
      <CrmWorkflowMetricsPanel
        metrics={props.crmWorkflowMetrics}
        loading={props.loading}
        error={props.error}
      />
    </main>
  );
}
