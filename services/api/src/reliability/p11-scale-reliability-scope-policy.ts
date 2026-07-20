import type { P11ReadinessPolicy } from "./scale-reliability-readiness-types";

export const p11ScaleReliabilityScopePolicy: P11ReadinessPolicy = {
  phase: "p11",
  title: "P11 Scale / Reliability / Billing",
  readinessNotLaunch: true,
  categories: [
    {
      key: "scope",
      label: "Scale / reliability / billing scope",
      status: "ready",
      summary:
        "P11-PR-01 defines readiness boundaries only; no billing, quota, job, CRM, outbound, or AI side effects.",
      workspaceScoped: true,
      aggregateFirst: true,
      mutationEnabled: false,
    },
  ],
  safety: {
    noPaymentProviderIntegration: true,
    noChargingCustomers: true,
    noInvoiceCreation: true,
    noSubscriptionMutation: true,
    noQuotaEnforcement: true,
    noCrmMutation: true,
    noOutboundSend: true,
    noRealAiProvider: true,
    noRawCustomerMessages: true,
    noRawProviderPayload: true,
    noRawWebhookPayload: true,
    noAccessToken: true,
    noRefreshToken: true,
    noCookies: true,
  },
};

export function getP11ScaleReliabilityScopePolicy(): P11ReadinessPolicy {
  return p11ScaleReliabilityScopePolicy;
}
