import type { RedactionHardeningReadinessResponse } from "../api/types";

type RedactionHardeningReadinessPanelProps = {
  readiness: RedactionHardeningReadinessResponse | null;
  loading: boolean;
  error: string | null;
};

export function RedactionHardeningReadinessPanel(
  props: RedactionHardeningReadinessPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Redaction Hardening Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P10 redaction hardening</p>
          <h2>Redaction Hardening Readiness</h2>
        </div>
        <span className="badge">Safe summary only</span>
      </div>

      {props.loading ? <p>Loading redaction hardening readiness...</p> : null}
      {props.error ? <p className="error-text">{props.error}</p> : null}

      {props.readiness ? (
        <>
          <p>
            Sensitive field classifier status for compliance readiness. Raw
            before/after samples are intentionally not displayed.
          </p>
          <div className="crm-facts-grid">
            {props.readiness.classifiers.map((classifier) => (
              <article className="state-card" key={classifier.classifierKey}>
                <strong>{classifier.label}</strong>
                <p>{classifier.action}</p>
                <p>{classifier.severity}</p>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
