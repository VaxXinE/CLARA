import type {
  CrmWorkflowMetricsResponse,
  KpiDashboardResponse,
} from "../api/types";
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
