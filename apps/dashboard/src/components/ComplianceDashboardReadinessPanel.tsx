import type { ComplianceDashboardResponse } from "../api/types";

type ComplianceDashboardReadinessPanelProps = {
  readiness: ComplianceDashboardResponse | null;
  loading: boolean;
  error: string | null;
};

export function ComplianceDashboardReadinessPanel(
  props: ComplianceDashboardReadinessPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Compliance Dashboard Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P10 compliance dashboard</p>
          <h2>Compliance Dashboard</h2>
        </div>
        <span className="badge">Not certification</span>
      </div>

      {props.loading ? <p>Loading compliance dashboard...</p> : null}
      {props.error ? <p className="error-text">{props.error}</p> : null}

      {props.readiness ? (
        <>
          <p>
            Workspace-scoped compliance readiness summary. Evidence export and
            certification claims are intentionally not enabled.
          </p>
          <div className="crm-facts-grid">
            {props.readiness.categories.map((category) => (
              <article className="state-card" key={category.categoryKey}>
                <strong>{category.label}</strong>
                <p>
                  {category.status} · risk {category.riskLevel}
                </p>
                <p>{category.safeEvidenceSummary}</p>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
