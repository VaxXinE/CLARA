import type { PermissionAuditReadinessResponse } from "../api/types";

type PermissionAuditReadinessPanelProps = {
  readiness: PermissionAuditReadinessResponse | null;
  loading: boolean;
  error: string | null;
};

export function PermissionAuditReadinessPanel(
  props: PermissionAuditReadinessPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Permission Audit Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P10 permission audit</p>
          <h2>Permission Audit Readiness</h2>
        </div>
        <span className="badge">Read-only</span>
      </div>

      {props.loading ? <p>Loading permission audit readiness...</p> : null}
      {props.error ? <p className="error-text">{props.error}</p> : null}

      {props.readiness ? (
        <>
          <p>
            Permission readiness is role-boundary evidence only. Role changes,
            permission edits, and escalation actions are not available here.
          </p>

          <div className="crm-facts-grid">
            {props.readiness.roleBoundaries.map((boundary) => (
              <article className="state-card" key={boundary.role}>
                <strong>{boundary.role}</strong>
                <p>{boundary.allowedSurfaceKeys.join(", ")}</p>
                <p>Denied: {boundary.deniedSurfaceKeys.join(", ")}</p>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
