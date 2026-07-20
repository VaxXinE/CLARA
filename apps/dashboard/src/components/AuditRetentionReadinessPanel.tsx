import type { AuditRetentionReadinessResponse } from "../api/types";

type AuditRetentionReadinessPanelProps = {
  readiness: AuditRetentionReadinessResponse | null;
  loading: boolean;
  error: string | null;
};

export function AuditRetentionReadinessPanel(
  props: AuditRetentionReadinessPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Audit Retention Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P10 audit retention</p>
          <h2>Audit Retention Readiness</h2>
        </div>
        <span className="badge">Compliance readiness, not certification</span>
      </div>

      {props.loading ? <p>Loading audit retention readiness...</p> : null}
      {props.error ? <p className="error-text">{props.error}</p> : null}

      {props.readiness ? (
        <>
          <p>
            Read-only evidence for safe audit metadata. Deletion, legal hold,
            retention jobs, and export are not implemented here.
          </p>
          <div className="crm-facts-grid">
            {props.readiness.categories.map((category) => (
              <article className="state-card" key={category.categoryKey}>
                <strong>{category.label}</strong>
                <p>{category.dataClassification}</p>
                <p>{category.description}</p>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
