import type { BillingPlanEntitlementReadinessResponse } from "../api/types";

type Props = {
  readiness?: BillingPlanEntitlementReadinessResponse | null;
};

const fallbackControls = [
  [
    "Billing Readiness",
    "Policy only; no payment provider integration or customer charging.",
  ],
  [
    "Payment Provider Boundary",
    "Checkout, charge execution, and payment method storage are not launched.",
  ],
  [
    "Plan Catalog",
    "Comparison policy only; no upgrade, downgrade, cancellation, or plan mutation.",
  ],
  [
    "Plan Entitlement",
    "Entitlement and quota linkage are defined without mutation or enforcement.",
  ],
  [
    "Subscription Lifecycle",
    "Lifecycle policy only; no checkout, renewal, proration, cancellation, or tax logic.",
  ],
] as const;

export function BillingPlanEntitlementReadinessPanel({ readiness }: Props) {
  const controls =
    readiness?.controls.map(
      (control) => [control.label, control.description] as const,
    ) ?? fallbackControls;

  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Billing Plan Entitlement Readiness"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P11 readiness</p>
          <h2>Billing / Plan / Entitlement</h2>
        </div>
        <span className="badge">Readiness, not billing launch</span>
      </div>

      <p>
        Read-only billing readiness. No customer charging, invoice creation,
        checkout session, payment provider integration, subscription mutation,
        plan mutation, entitlement mutation, quota enforcement, CRM mutation,
        outbound send, or real AI provider behavior is available here.
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
          Workspace-scoped: {readiness.workspaceId}. Aggregate-first:{" "}
          {readiness.safeBillingSummary.aggregateOnly ? "yes" : "no"}. Customer
          charged: {readiness.safety.customerCharged ? "yes" : "no"}.
        </p>
      ) : null}
    </section>
  );
}
