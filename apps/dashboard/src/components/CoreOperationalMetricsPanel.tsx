import type { AnalyticsOverviewResponse } from "../api/types";

type CoreOperationalMetricsPanelProps = {
  overview: AnalyticsOverviewResponse | null;
  loading?: boolean;
  error?: string | null;
};

function metricValue(value: number | string): string {
  return typeof value === "number" ? value.toLocaleString("en-US") : value;
}

function MetricSection(props: {
  title: string;
  metrics: AnalyticsOverviewResponse["sections"]["conversationVolume"]["metrics"];
}) {
  return (
    <div className="state-card">
      <strong>{props.title}</strong>
      <ul>
        {props.metrics.map((metric) => (
          <li key={metric.metricKey}>
            {metric.label}: {metricValue(metric.value)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CoreOperationalMetricsPanel(
  props: CoreOperationalMetricsPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Core Operational Metrics Pack"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P9 Analytics</p>
          <h2>Core Operational Metrics Pack</h2>
        </div>
        <span className="badge">aggregate-only</span>
      </div>

      {props.loading ? <p>Loading operational metrics.</p> : null}
      {props.error ? <p className="panel-error">{props.error}</p> : null}

      {props.overview ? (
        <>
          <dl className="crm-facts-grid">
            <div>
              <dt>Workspace</dt>
              <dd>{props.overview.workspaceId}</dd>
            </div>
            <div>
              <dt>Time window</dt>
              <dd>{props.overview.timeWindow}</dd>
            </div>
            <div>
              <dt>Channel</dt>
              <dd>{props.overview.channel}</dd>
            </div>
          </dl>

          <MetricSection
            title="Conversation Volume Metrics"
            metrics={props.overview.sections.conversationVolume.metrics}
          />
          <MetricSection
            title="Response Time / SLA"
            metrics={props.overview.sections.responseTimeSla.metrics}
          />
          <MetricSection
            title="Channel Performance Metrics"
            metrics={props.overview.sections.channelPerformance.metrics}
          />
        </>
      ) : (
        <p>Operational metric data is not loaded yet.</p>
      )}

      <div className="state-card">
        <strong>Privacy and safety</strong>
        <p>
          Metrics are workspace-scoped, aggregate-first, read-only, and
          PII-minimized. Raw customer messages, raw provider payloads, raw
          webhook payloads, tokens, cookies, auth headers, secrets, DOM, HTML,
          prompts, downloadable reports, and per-customer detail views are
          excluded.
        </p>
      </div>
    </section>
  );
}
