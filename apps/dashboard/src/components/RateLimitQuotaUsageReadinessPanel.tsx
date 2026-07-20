import type { RateLimitQuotaUsageReadinessResponse } from "../api/types";

type Props = {
  readiness?: RateLimitQuotaUsageReadinessResponse | null;
};

const fallbackControls = [
  [
    "Rate Limit readiness",
    "Per-workspace, per-user, endpoint, burst, and safe 429 policy.",
  ],
  [
    "Quota readiness",
    "Soft limit, hard limit, and grace period policy; no enforcement.",
  ],
  [
    "Usage Metering readiness",
    "Aggregate-first, workspace-scoped usage summary only.",
  ],
  [
    "Billing metadata boundary",
    "Safe billing metadata only; no charging or invoice creation.",
  ],
] as const;

export function RateLimitQuotaUsageReadinessPanel({ readiness }: Props) {
  const controls =
    readiness?.controls.map(
      (control) => [control.label, control.description] as const,
    ) ?? fallbackControls;

  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Rate Limit Quota Usage Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P11 readiness</p>
          <h2>Rate Limit / Quota / Usage</h2>
        </div>
        <span className="badge">Readiness, not billing launch</span>
      </div>

      <p>
        Read-only scale and billing readiness. No quota enforcement, no payment
        provider integration, no customer charging, no invoice creation, and no
        subscription, plan, or entitlement mutation controls are shown.
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
          Workspace-scoped: {readiness.workspaceId}. Aggregate-only usage:{" "}
          {readiness.usageSummary.aggregateOnly ? "yes" : "no"}. Quota enforced:{" "}
          {readiness.safety.quotaEnforced ? "yes" : "no"}.
        </p>
      ) : null}
    </section>
  );
}
