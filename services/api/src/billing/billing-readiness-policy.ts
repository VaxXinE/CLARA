import type {
  BillingReadiness,
  BillingReadinessControl,
} from "./billing-readiness-types";

export function getBillingReadinessPolicy(): BillingReadiness {
  return {
    billingPolicyDefined: true,
    paymentProviderBoundaryDefined: true,
    invoiceBoundaryDefined: true,
    subscriptionBoundaryDefined: true,
    chargingImplemented: false,
    invoiceCreationImplemented: false,
    paymentProviderIntegrated: false,
    paymentMethodStorageImplemented: false,
  };
}

export function getBillingReadinessControls(): BillingReadinessControl[] {
  return [
    {
      controlKey: "billing_boundary",
      label: "Billing Readiness",
      description:
        "Billing is policy-only: no payment provider integration, no charging customers, and no invoice creation.",
      status: "planned",
      severity: "warning",
      evidenceType: "policy",
    },
    {
      controlKey: "plan_catalog_boundary",
      label: "Plan Catalog",
      description:
        "Plan catalog comparison is defined, but upgrade, downgrade, cancellation, and plan mutation are not implemented.",
      status: "planned",
      severity: "warning",
      evidenceType: "policy",
    },
    {
      controlKey: "entitlement_boundary",
      label: "Plan Entitlement",
      description:
        "Entitlement and quota linkage policy is defined, but entitlement mutation and quota enforcement are not implemented.",
      status: "planned",
      severity: "warning",
      evidenceType: "runtime_guardrail",
    },
    {
      controlKey: "safe_metadata",
      label: "Safe billing metadata",
      description:
        "Readiness output is aggregate-first and workspace-scoped with no raw usage events or payment data.",
      status: "ready",
      severity: "info",
      evidenceType: "test",
    },
  ];
}
