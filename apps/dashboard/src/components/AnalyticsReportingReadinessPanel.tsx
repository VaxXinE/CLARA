const allowedCategories = [
  "operational",
  "customer engagement",
  "channel performance",
  "crm workflow",
  "audit compliance",
  "operator productivity",
  "sla readiness",
];

const privacyRules = [
  "Backend AuthContext is source of truth.",
  "Metrics are workspace-scoped and aggregate-first.",
  "Raw payloads, secrets, cookies, auth headers, DOM, HTML, prompts, and customer messages are excluded.",
  "KPI dashboards, exports, and scheduled aggregation jobs are not implemented yet.",
];

export function AnalyticsReportingReadinessPanel() {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Analytics reporting readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P9 Analytics / Reporting / KPI</p>
          <h2>Analytics readiness</h2>
        </div>
        <span className="badge">policy-only</span>
      </div>

      <p>
        KPI dashboards are not implemented yet. P9 starts with metric contracts,
        privacy boundaries, and workspace-scoped policy validation.
      </p>

      <div className="state-card">
        <strong>Allowed metric categories</strong>
        <ul>
          {allowedCategories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </div>

      <div className="state-card">
        <strong>Privacy rules</strong>
        <ul>
          {privacyRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
