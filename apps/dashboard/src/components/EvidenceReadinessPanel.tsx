import type { EvidenceReadinessResponse } from "../api/types";

type EvidenceReadinessPanelProps = {
  readiness: EvidenceReadinessResponse | null;
  loading: boolean;
  error: string | null;
};

export function EvidenceReadinessPanel(props: EvidenceReadinessPanelProps) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Evidence Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P10 evidence readiness</p>
          <h2>Evidence Readiness</h2>
        </div>
        <span className="badge">Not certification</span>
      </div>

      {props.loading ? <p>Loading evidence readiness...</p> : null}
      {props.error ? <p className="error-text">{props.error}</p> : null}

      {props.readiness ? (
        <>
          <p>
            Safe evidence summary only. Evidence export, download, and raw
            evidence browsing are not enabled.
          </p>
          <div className="crm-facts-grid">
            {props.readiness.categories.map((category) => (
              <article className="state-card" key={category.categoryKey}>
                <strong>{category.label}</strong>
                <p>
                  {category.classification} · {category.evidenceSource}
                </p>
                <p>{category.description}</p>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
