import type { CustomerOwnerAssignmentReadinessResponse } from "../api/types";

type CustomerOwnerAssignmentReadinessPanelProps = {
  readiness: CustomerOwnerAssignmentReadinessResponse | null;
  loading: boolean;
  error: string | null;
};

function label(value: string): string {
  return value.replaceAll("_", " ");
}

export function CustomerOwnerAssignmentReadinessPanel(
  props: CustomerOwnerAssignmentReadinessPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Customer owner assignment readiness"
    >
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Owner assignment</span>
          <h2>Assignment readiness</h2>
        </div>
        <span className="badge">review-only</span>
      </div>

      {props.loading ? <p>Loading owner assignment readiness...</p> : null}
      {props.error ? <p className="panel-error">{props.error}</p> : null}

      {!props.loading && !props.error && !props.readiness ? (
        <p>No owner assignment readiness selected. This panel is read-only.</p>
      ) : null}

      {props.readiness ? (
        <div className="crm-placeholder-stack">
          <div>
            <strong>{label(props.readiness.readiness.level)}</strong>
            <ul>
              {props.readiness.readiness.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Current ownership</strong>
            <p>
              {props.readiness.currentOwnership.hasOwner
                ? "Owner exists"
                : "No owner recorded"}
            </p>
            <p>
              Source: {label(props.readiness.currentOwnership.ownershipSource)}
            </p>
          </div>

          <div>
            <strong>Suggested review</strong>
            <p>
              {label(props.readiness.suggestedAssignment.recommendedRole)} ·{" "}
              {label(props.readiness.suggestedAssignment.recommendedAction)}
            </p>
            <p>{props.readiness.suggestedAssignment.reason}</p>
            <p>
              Required permission:{" "}
              {props.readiness.suggestedAssignment.requiredPermission}
            </p>
          </div>

          <div>
            <strong>Risk</strong>
            <p>
              {label(props.readiness.risk.level)} ·{" "}
              {props.readiness.risk.blocked ? "blocked" : "reviewable"}
            </p>
            <ul>
              {props.readiness.risk.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>

          <p className="muted-copy">
            Readiness-only. ownerAssigned=false. actionExecuted=false. No owner
            was assigned.
          </p>
        </div>
      ) : null}
    </section>
  );
}
