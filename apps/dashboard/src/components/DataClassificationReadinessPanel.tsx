import type { DataClassificationReadinessResponse } from "../api/types";

type DataClassificationReadinessPanelProps = {
  readiness: DataClassificationReadinessResponse | null;
  loading: boolean;
  error: string | null;
};

export function DataClassificationReadinessPanel(
  props: DataClassificationReadinessPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Data Classification Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P10 data classification</p>
          <h2>Data Classification Readiness</h2>
        </div>
        <span className="badge">Read-only</span>
      </div>

      {props.loading ? <p>Loading data classification readiness...</p> : null}
      {props.error ? <p className="error-text">{props.error}</p> : null}

      {props.readiness ? (
        <>
          <p>
            Runtime classification labels guide redaction and safe dashboard
            visibility. This panel does not expose restricted content.
          </p>
          <div className="crm-facts-grid">
            {props.readiness.dataClasses.map((dataClass) => (
              <article className="state-card" key={dataClass.dataClassKey}>
                <strong>{dataClass.label}</strong>
                <p>{dataClass.classification}</p>
                <p>{dataClass.handlingRules.join(", ")}</p>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
