import type { SessionPolicyReadinessResponse } from "../api/types";

type SessionPolicyReadinessPanelProps = {
  readiness: SessionPolicyReadinessResponse | null;
  loading: boolean;
  error: string | null;
};

export function SessionPolicyReadinessPanel(
  props: SessionPolicyReadinessPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Session Policy Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P10 session policy</p>
          <h2>Session Policy</h2>
        </div>
        <span className="badge">Compliance readiness</span>
      </div>

      {props.loading ? <p>Loading session policy readiness...</p> : null}
      {props.error ? <p className="error-text">{props.error}</p> : null}

      {props.readiness ? (
        <>
          <p>
            Session controls are documented as safe policy boundaries. Session
            revocation, force logout, SSO, and MFA are not implemented here.
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
