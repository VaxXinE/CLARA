import type { CustomerLifecycleStatusReadinessResponse } from "../api/types";

type CustomerLifecycleStatusReadinessPanelProps = {
  readiness: CustomerLifecycleStatusReadinessResponse | null;
  loading: boolean;
  error: string | null;
};

function label(value: string): string {
  return value.replaceAll("_", " ");
}

export function CustomerLifecycleStatusReadinessPanel(
  props: CustomerLifecycleStatusReadinessPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Customer lifecycle status readiness"
    >
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Lifecycle status</span>
          <h2>Status readiness</h2>
        </div>
        <span className="badge">review-only</span>
      </div>

      {props.loading ? <p>Loading lifecycle/status readiness...</p> : null}
      {props.error ? <p className="panel-error">{props.error}</p> : null}

      {!props.loading && !props.error && !props.readiness ? (
        <p>No lifecycle/status readiness selected. This panel is read-only.</p>
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
            <strong>Current lifecycle/status</strong>
            <p>
              {label(props.readiness.currentState.lifecycle)} ·{" "}
              {label(props.readiness.currentState.status)}
            </p>
            <p>Source: {label(props.readiness.currentState.source)}</p>
          </div>

          <div>
            <strong>Suggested review</strong>
            <p>
              {label(props.readiness.suggestedChange.recommendedLifecycle)} ·{" "}
              {label(props.readiness.suggestedChange.recommendedStatus)}
            </p>
            <p>{props.readiness.suggestedChange.reason}</p>
            <p>
              Required permission:{" "}
              {props.readiness.suggestedChange.requiredPermission}
            </p>
          </div>

          <div>
            <strong>Transition policy</strong>
            <p>
              {props.readiness.transitionPolicy.allowedForReview
                ? "Allowed for human review"
                : "Blocked"}
            </p>
            {props.readiness.transitionPolicy.blockedReason ? (
              <p>{props.readiness.transitionPolicy.blockedReason}</p>
            ) : null}
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
            Readiness-only. lifecycleUpdated=false. statusUpdated=false.
            actionExecuted=false. No lifecycle/status was changed.
          </p>
        </div>
      ) : null}
    </section>
  );
}
