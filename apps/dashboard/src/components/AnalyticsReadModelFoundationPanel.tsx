import type {
  AnalyticsMetricCatalogResponse,
  AnalyticsReadinessResponse,
} from "../api/types";

type AnalyticsReadModelFoundationPanelProps = {
  readiness: AnalyticsReadinessResponse | null;
  metricCatalog: AnalyticsMetricCatalogResponse | null;
  loading?: boolean;
  error?: string | null;
};

const fallbackCategories = [
  "operational",
  "customer_engagement",
  "channel_performance",
  "crm_workflow",
  "audit_compliance",
  "operator_productivity",
  "sla_readiness",
];

export function AnalyticsReadModelFoundationPanel(
  props: AnalyticsReadModelFoundationPanelProps,
) {
  const categories =
    props.metricCatalog?.categories ??
    props.readiness?.allowedCategories ??
    fallbackCategories;
  const metrics = props.metricCatalog?.metrics ?? [];

  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Analytics read model foundation"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Analytics Read Model</p>
          <h2>Metric foundation</h2>
        </div>
        <span className="badge">foundation-ready</span>
      </div>

      {props.loading ? <p>Loading analytics foundation status.</p> : null}
      {props.error ? <p className="panel-error">{props.error}</p> : null}

      <dl className="crm-facts-grid">
        <div>
          <dt>Runtime metrics</dt>
          <dd>
            {props.readiness?.readiness.runtimeMetricsImplemented
              ? "implemented"
              : "not implemented yet"}
          </dd>
        </div>
        <div>
          <dt>Scheduled aggregation</dt>
          <dd>
            {props.readiness?.readiness.scheduledAggregationImplemented
              ? "implemented"
              : "not implemented yet"}
          </dd>
        </div>
        <div>
          <dt>Report export</dt>
          <dd>
            {props.readiness?.readiness.reportExportImplemented
              ? "implemented"
              : "not implemented yet"}
          </dd>
        </div>
      </dl>

      <div className="state-card">
        <strong>Allowed categories</strong>
        <ul>
          {categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </div>

      <div className="state-card">
        <strong>Metric registry</strong>
        <p>
          {metrics.length > 0
            ? `${metrics.length} metric contracts are foundation-ready.`
            : "Metric contracts are defined by backend policy."}
        </p>
      </div>

      <div className="state-card">
        <strong>Privacy and safety</strong>
        <p>
          Workspace-scoped, aggregate-first, read-only, PII-minimized output
          only. Raw payloads, raw customer messages, tokens, cookies, auth
          headers, secrets, DOM, HTML, and prompts are excluded.
        </p>
      </div>
    </section>
  );
}
