import type { ObservabilitySloAlertReadinessResponse } from "../api/types";

type Props = {
  readiness?: ObservabilitySloAlertReadinessResponse | null;
};

const fallbackControls = [
  [
    "Observability readiness",
    "Structured logging, correlation ID, redaction, metric naming, and tracing policy.",
  ],
  [
    "SLO Dashboard readiness",
    "Availability, latency, error rate, queue, webhook, outbound delivery, and error budget policy.",
  ],
  [
    "Alert readiness",
    "Severity model, escalation policy, and incident response links only.",
  ],
  [
    "Safe telemetry summary",
    "Aggregate-only, workspace-scoped readiness without vendor export.",
  ],
] as const;

export function ObservabilitySloAlertReadinessPanel({ readiness }: Props) {
  const controls =
    readiness?.controls.map(
      (control) => [control.label, control.description] as const,
    ) ?? fallbackControls;

  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Observability SLO Alert Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P11 readiness</p>
          <h2>Observability / SLO / Alert</h2>
        </div>
        <span className="badge">Readiness, not SLA launch</span>
      </div>

      <p>
        Read-only observability readiness. No alert execution, no notification
        send, no vendor provider integration, no telemetry export, and no
        billing or CRM mutation controls are shown.
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
          Workspace-scoped: {readiness.workspaceId}. Aggregate-only telemetry:{" "}
          {readiness.safeTelemetrySummary.aggregateOnly ? "yes" : "no"}. Alert
          sent: {readiness.safety.alertSent ? "yes" : "no"}.
        </p>
      ) : null}
    </section>
  );
}
