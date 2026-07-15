import type { CustomerFollowUpProposalResponse } from "../api/types";

type CustomerFollowUpProposalPanelProps = {
  proposal: CustomerFollowUpProposalResponse | null;
  loading: boolean;
  error: string | null;
};

function label(value: string): string {
  return value.replaceAll("_", " ");
}

export function CustomerFollowUpProposalPanel(
  props: CustomerFollowUpProposalPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Customer follow-up proposal"
    >
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Follow-up proposal</span>
          <h2>Task workflow review</h2>
        </div>
        <span className="badge">review-only</span>
      </div>

      {props.loading ? <p>Loading follow-up proposal...</p> : null}
      {props.error ? <p className="panel-error">{props.error}</p> : null}

      {!props.loading && !props.error && !props.proposal ? (
        <p>No follow-up proposal selected. Proposals are proposal-only.</p>
      ) : null}

      {props.proposal ? (
        <div className="crm-placeholder-stack">
          <div>
            <strong>{props.proposal.title}</strong>
            <p>{props.proposal.summary}</p>
            <p className="muted-copy">
              {label(props.proposal.followUp.intent)} ·{" "}
              {label(props.proposal.followUp.recommendedChannel)}
            </p>
          </div>

          <div>
            <strong>Timing</strong>
            <p>
              {label(props.proposal.followUp.urgency)} ·{" "}
              {label(props.proposal.followUp.dueWindow)}
            </p>
            <p>{props.proposal.followUp.reason}</p>
          </div>

          <div>
            <strong>{props.proposal.proposedTask.taskTitle}</strong>
            <p>{props.proposal.proposedTask.taskDescription}</p>
            <p>
              Required permission:{" "}
              {props.proposal.proposedTask.requiredPermission}
            </p>
          </div>

          <div>
            <strong>Risk</strong>
            <p>
              {label(props.proposal.risk.level)} ·{" "}
              {props.proposal.risk.blocked ? "blocked" : "reviewable"}
            </p>
            <ul>
              {props.proposal.risk.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>

          <p className="muted-copy">
            Review-only. taskCreated=false. actionExecuted=false. No task was
            created.
          </p>
        </div>
      ) : null}
    </section>
  );
}
