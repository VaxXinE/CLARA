import { QueueJobReliabilityReadinessPanel } from "./QueueJobReliabilityReadinessPanel";
import { RateLimitQuotaUsageReadinessPanel } from "./RateLimitQuotaUsageReadinessPanel";
import { ObservabilitySloAlertReadinessPanel } from "./ObservabilitySloAlertReadinessPanel";
import { BillingPlanEntitlementReadinessPanel } from "./BillingPlanEntitlementReadinessPanel";
import { PerformanceCapacityReadinessPanel } from "./PerformanceCapacityReadinessPanel";

const readinessCategories = [
  ["SLO readiness", "Targets defined; no external SLA promise yet."],
  [
    "Reliability baseline",
    "Idempotency, retries, fallback, and timeout policy.",
  ],
  ["Queue/job readiness", "Policy only; no background job execution."],
  [
    "Rate limit readiness",
    "Abuse controls remain required before scale launch.",
  ],
  [
    "Usage metering readiness",
    "Workspace-scoped, aggregate-first counts only.",
  ],
  ["Billing readiness", "No payment provider integration or charging."],
  [
    "Capacity/performance readiness",
    "Load testing belongs in explicit runbooks.",
  ],
] as const;

export function ScaleReliabilityBillingReadinessPanel() {
  return (
    <>
      <section
        className="panel crm-skeleton-panel"
        aria-label="Scale Reliability Billing Readiness"
      >
        <div className="panel-heading">
          <div>
            <p className="eyebrow">P11 readiness</p>
            <h2>Scale / Reliability / Billing</h2>
          </div>
          <span className="badge">Readiness, not launch</span>
        </div>

        <p>
          Workspace-scoped readiness view only. It does not launch billing,
          enforce quota, run load tests, send messages, or mutate customer data.
        </p>

        <div className="crm-facts-grid">
          {readinessCategories.map(([label, summary]) => (
            <article className="state-card" key={label}>
              <strong>{label}</strong>
              <p>{summary}</p>
            </article>
          ))}
        </div>
      </section>

      <QueueJobReliabilityReadinessPanel />
      <RateLimitQuotaUsageReadinessPanel />
      <ObservabilitySloAlertReadinessPanel />
      <BillingPlanEntitlementReadinessPanel />
      <PerformanceCapacityReadinessPanel />
    </>
  );
}
