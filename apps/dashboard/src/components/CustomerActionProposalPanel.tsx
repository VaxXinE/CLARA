import type { CustomerActionProposalResponse } from "../api/types";

type CustomerActionProposalPanelProps = {
  proposal: CustomerActionProposalResponse | null;
  loading: boolean;
  error: string | null;
};

function label(value: string): string {
  return value.replaceAll("_", " ");
}

export function CustomerActionProposalPanel(
  props: CustomerActionProposalPanelProps,
) {
  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Customer action proposal"
    >
      <div className="panel-heading">
        <div>
          <span className="eyebrow">CRM proposal</span>
          <h2>Reviewable action proposal</h2>
        </div>
        <span className="badge">proposal-only</span>
      </div>

      {props.loading ? <p>Loading action proposal...</p> : null}
      {props.error ? <p className="panel-error">{props.error}</p> : null}

      {!props.loading && !props.error && !props.proposal ? (
        <p>No CRM action proposal selected. Proposals are review-only.</p>
      ) : null}

      {props.proposal ? (
        <div className="crm-placeholder-stack">
          <div>
            <strong>{props.proposal.title}</strong>
            <p>{props.proposal.summary}</p>
            <p className="muted-copy">
              {label(props.proposal.proposalType)} ·{" "}
              {label(props.proposal.proposedAction.actionKind)}
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

          <div>
            <strong>Review next step</strong>
            <p>{props.proposal.review.nextStep}</p>
            <p>
              Required permission:{" "}
              {props.proposal.proposedAction.requiredPermission}
            </p>
          </div>

          <p className="muted-copy">
            Review-only. mutationExecuted=false. No CRM mutation was executed.
          </p>
        </div>
      ) : null}
    </section>
  );
}
