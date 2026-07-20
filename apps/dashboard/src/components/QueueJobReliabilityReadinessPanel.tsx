import type { QueueJobReliabilityReadinessResponse } from "../api/types";

type Props = {
  readiness?: QueueJobReliabilityReadinessResponse | null;
};

const fallbackControls = [
  ["Queue / Job Reliability", "Policy ready; no worker execution."],
  ["Retry", "Bounded backoff required; no retry execution."],
  ["Idempotency", "Workspace-scoped dedup required; no replay."],
  ["Dead Letter", "Operator review readiness; no purge."],
] as const;

export function QueueJobReliabilityReadinessPanel({ readiness }: Props) {
  const controls =
    readiness?.controls.map(
      (control) => [control.label, control.description] as const,
    ) ?? fallbackControls;

  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Queue Job Reliability Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P11 readiness</p>
          <h2>Queue / Job Reliability</h2>
        </div>
        <span className="badge">Readiness, not launch</span>
      </div>

      <p>
        Queue reliability, retry, idempotency, Dead Letter, and failure
        classification are visible as policy only. No worker execution, no job
        enqueue, no retry execution, no replay, and no purge controls are shown.
      </p>

      <div className="crm-facts-grid">
        {controls.map(([label, summary]) => (
          <article className="state-card" key={label}>
            <strong>{label}</strong>
            <p>{summary}</p>
          </article>
        ))}
      </div>

      {readiness ? (
        <p className="muted">
          Workspace-scoped: {readiness.workspaceId}. Worker implemented:{" "}
          {readiness.queueJobReliability.workerImplemented ? "yes" : "no"}.
        </p>
      ) : null}
    </section>
  );
}
