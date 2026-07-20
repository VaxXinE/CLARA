import type { TenantIsolationReadinessResponse } from "../api/types";

type TenantIsolationReadinessPanelProps = {
  readiness: TenantIsolationReadinessResponse | null;
  loading: boolean;
  error: string | null;
};

export function TenantIsolationReadinessPanel(
  props: TenantIsolationReadinessPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Tenant Isolation Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P10 tenant isolation</p>
          <h2>Tenant Isolation Readiness</h2>
        </div>
        <span className="badge">Read-only</span>
      </div>

      {props.loading ? <p>Loading tenant isolation readiness...</p> : null}
      {props.error ? <p className="error-text">{props.error}</p> : null}

      {props.readiness ? (
        <>
          <p>
            Workspace {props.readiness.workspaceId} uses backend AuthContext as
            the authority for organization and workspace scope. Client-supplied
            workspace values are not authority.
          </p>

          <div className="crm-facts-grid">
            {props.readiness.checks.map((check) => (
              <article className="state-card" key={check.checkKey}>
                <strong>{check.label}</strong>
                <p>{check.status}</p>
                <p>{check.description}</p>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
