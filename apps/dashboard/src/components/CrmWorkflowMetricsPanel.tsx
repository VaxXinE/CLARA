import type { CrmWorkflowMetricsResponse } from "../api/types";

type CrmWorkflowMetricsPanelProps = {
  metrics: CrmWorkflowMetricsResponse | null;
  loading?: boolean;
  error?: string | null;
};

function metricValue(value: number | string): string {
  return typeof value === "number" ? value.toLocaleString("en-US") : value;
}

export function CrmWorkflowMetricsPanel(props: CrmWorkflowMetricsPanelProps) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="CRM Workflow Metrics"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P9 Analytics</p>
          <h2>CRM Workflow Metrics</h2>
        </div>
        <span className="badge">aggregate-only</span>
      </div>

      {props.loading ? <p>Loading CRM workflow metrics.</p> : null}
      {props.error ? <p className="panel-error">{props.error}</p> : null}

      {props.metrics ? (
        <>
          <dl className="crm-facts-grid">
            <div>
              <dt>Workspace</dt>
              <dd>{props.metrics.workspaceId}</dd>
            </div>
            <div>
              <dt>Time window</dt>
              <dd>{props.metrics.timeWindow}</dd>
            </div>
          </dl>

          <ul className="state-card">
            {props.metrics.metrics.map((metric) => (
              <li key={metric.metricKey}>
                {metric.label}: {metricValue(metric.value)}
              </li>
            ))}
          </ul>

          <div className="state-card">
            <strong>Read-only CRM workflow safety</strong>
            <p>
              These metrics count review-only CRM surfaces and blocked sensitive
              actions. They do not create tasks, write notes, assign owners,
              update lifecycle status, send outbound messages, or call an AI
              provider.
            </p>
          </div>
        </>
      ) : (
        <p>CRM workflow metric data is not loaded yet.</p>
      )}
    </section>
  );
}
