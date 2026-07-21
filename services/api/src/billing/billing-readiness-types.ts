import type { AuthContext } from "../auth/auth-context";

export type BillingReadinessControl = {
  controlKey: string;
  label: string;
  description: string;
  status: "ready" | "planned" | "blocked";
  severity: "info" | "warning" | "critical";
  evidenceType:
    | "policy"
    | "test"
    | "runbook"
    | "runtime_guardrail"
    | "dashboard_boundary"
    | "extension_boundary";
};

export type BillingReadiness = {
  billingPolicyDefined: true;
  paymentProviderBoundaryDefined: true;
  invoiceBoundaryDefined: true;
  subscriptionBoundaryDefined: true;
  chargingImplemented: false;
  invoiceCreationImplemented: false;
  paymentProviderIntegrated: false;
  paymentMethodStorageImplemented: false;
};

export type SubscriptionLifecycleBoundary = {
  lifecyclePolicyDefined: true;
  checkoutImplemented: false;
  renewalImplemented: false;
  cancellationImplemented: false;
  prorationImplemented: false;
  taxLogicImplemented: false;
};

export type SafeBillingSummary = {
  aggregateOnly: true;
  workspaceScoped: true;
  rawUsageEventsIncluded: false;
  rawCustomerMessagesIncluded: false;
  rawProviderPayloadIncluded: false;
  rawWebhookPayloadIncluded: false;
  paymentDataIncluded: false;
  secretsIncluded: false;
};

export type BillingPlanEntitlementReadinessInput = {
  auth: AuthContext;
  generatedAt?: Date;
};

export type BillingPlanEntitlementReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p11";
  billingReadiness: BillingReadiness;
  planCatalogReadiness: import("./plan-catalog-readiness-types").PlanCatalogReadiness;
  entitlementReadiness: import("./entitlement-readiness-types").EntitlementReadiness;
  subscriptionLifecycleBoundary: SubscriptionLifecycleBoundary;
  safeBillingSummary: SafeBillingSummary;
  controls: BillingReadinessControl[];
  safety: {
    readOnly: true;
    mutationAllowed: false;
    customerCharged: false;
    invoiceCreated: false;
    paymentProviderCalled: false;
    subscriptionMutated: false;
    planMutated: false;
    entitlementMutated: false;
    quotaEnforced: false;
    usageCounterMutated: false;
    secretsIncluded: false;
  };
};
