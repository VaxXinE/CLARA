import type { PerformanceCapacityReadinessResponse } from "../api/types";

type Props = {
  readiness?: PerformanceCapacityReadinessResponse | null;
};

const fallbackControls = [
  [
    "Performance readiness",
    "Latency, throughput, error-rate, timeout, request-size, and degradation targets are defined.",
  ],
  [
    "Load test readiness",
    "Smoke and baseline profiles are documented; stress and soak profiles are manual only.",
  ],
  [
    "Capacity planning",
    "API, database, queue, dashboard, provider, usage, and billing assumptions are tracked.",
  ],
  [
    "Safe benchmark summary",
    "Synthetic, workspace-scoped, aggregate-only scenarios with no raw telemetry.",
  ],
] as const;

export function PerformanceCapacityReadinessPanel({ readiness }: Props) {
  const controls =
    readiness?.controls.map(
      (control) => [control.label, control.description] as const,
    ) ?? fallbackControls;

  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Performance Capacity Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P11 readiness</p>
          <h2>Performance / Load Test / Capacity</h2>
        </div>
        <span className="badge">Readiness, not execution</span>
      </div>

      <p>
        Read-only performance and capacity readiness. It does not run load
        tests, execute benchmarks, target production, call providers, charge
        customers, mutate CRM data, send outbound messages, or call a real AI
        provider.
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
          Workspace-scoped: {readiness.workspaceId}. Safe benchmark:{" "}
          {readiness.safeBenchmarkSummary.syntheticOnly
            ? "synthetic only"
            : "not safe"}
          . Production target:{" "}
          {readiness.safety.productionTargeted ? "yes" : "no"}.
        </p>
      ) : null}
    </section>
  );
}
