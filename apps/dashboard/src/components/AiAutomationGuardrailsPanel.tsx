import type { AiAutomationGuardrail } from "../api/types";

type AiAutomationGuardrailsPanelProps = {
  decision: AiAutomationGuardrail | null;
  loading: boolean;
  error: string | null;
  canEvaluate: boolean;
  onEvaluate: () => void;
};

function formatDecision(decision: AiAutomationGuardrail["decision"]): string {
  if (decision === "requires_human_approval") {
    return "Needs human approval";
  }

  return decision.charAt(0).toUpperCase() + decision.slice(1);
}

export function AiAutomationGuardrailsPanel(
  props: AiAutomationGuardrailsPanelProps,
) {
  return (
    <section className="workspace-card" aria-label="AI automation guardrails">
      <div className="section-kicker">AI guardrails</div>
      <h2>Automation readiness</h2>
      <p className="muted-copy">
        Read-only safety check. Clara evaluates requested AI actions before any
        operator workflow can use them.
      </p>

      <div className="status-grid">
        <div>
          <span className="status-label">Mode</span>
          <strong>Evaluation only</strong>
        </div>
        <div>
          <span className="status-label">Policy</span>
          <strong>{props.decision?.policyVersion ?? "not evaluated"}</strong>
        </div>
      </div>

      {props.decision ? (
        <div className="insight-card">
          <strong>{formatDecision(props.decision.decision)}</strong>
          <p>
            {props.decision.actionType} · {props.decision.riskLevel} risk ·{" "}
            {props.decision.safeReasonCode}
          </p>
          {props.decision.requiresHumanApproval ? (
            <p>Human approval is required before this action can continue.</p>
          ) : null}
          {props.decision.blockedReason ? (
            <p>{props.decision.blockedReason}</p>
          ) : null}
        </div>
      ) : null}

      {props.error ? <p className="error-copy">{props.error}</p> : null}

      <button
        type="button"
        className="secondary-button"
        onClick={props.onEvaluate}
        disabled={!props.canEvaluate || props.loading}
      >
        {props.loading ? "Evaluating..." : "Evaluate suggestion safety"}
      </button>
    </section>
  );
}
