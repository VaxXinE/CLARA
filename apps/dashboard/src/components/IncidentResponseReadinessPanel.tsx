import type { IncidentResponseReadinessResponse } from "../api/types";

type IncidentResponseReadinessPanelProps = {
  readiness: IncidentResponseReadinessResponse | null;
  loading: boolean;
  error: string | null;
};

export function IncidentResponseReadinessPanel(
  props: IncidentResponseReadinessPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Incident Response Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P10 incident response</p>
          <h2>Incident Response</h2>
        </div>
        <span className="badge">Readiness</span>
      </div>

      {props.loading ? <p>Loading incident readiness...</p> : null}
      {props.error ? <p className="error-text">{props.error}</p> : null}

      {props.readiness ? (
        <>
          <p>
            Severity, containment, communication, and review checklists are
            visible as summaries only.
          </p>
          <p>Levels: {props.readiness.severityLevels.join(", ")}</p>
          <div className="crm-facts-grid">
            {props.readiness.controls.map((control) => (
              <article className="state-card" key={control.controlKey}>
                <strong>{control.label}</strong>
                <p>
                  {control.status} · {control.severity}
                </p>
                <p>{control.safeEvidenceSummary}</p>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
