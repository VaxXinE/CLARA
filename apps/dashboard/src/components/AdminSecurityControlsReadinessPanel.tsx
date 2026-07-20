import type { AdminSecurityControlsReadinessResponse } from "../api/types";

type AdminSecurityControlsReadinessPanelProps = {
  readiness: AdminSecurityControlsReadinessResponse | null;
  loading: boolean;
  error: string | null;
};

export function AdminSecurityControlsReadinessPanel(
  props: AdminSecurityControlsReadinessPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Admin Security Controls Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P10 admin security</p>
          <h2>Admin Security Controls</h2>
        </div>
        <span className="badge">Read-only readiness</span>
      </div>

      {props.loading ? <p>Loading admin security readiness...</p> : null}
      {props.error ? <p className="error-text">{props.error}</p> : null}

      {props.readiness ? (
        <>
          <p>
            Backend AuthContext remains the authority. Frontend role guard is
            UX-only, and this panel does not mutate roles or permissions.
          </p>
          <div className="crm-facts-grid">
            {props.readiness.controls.map((control) => (
              <article className="state-card" key={control.controlKey}>
                <strong>{control.label}</strong>
                <p>{control.status}</p>
                <p>{control.description}</p>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
