export type P11ReadinessStatus = "ready" | "in_progress" | "planned";

export type P11ReadinessCategory = {
  key: string;
  label: string;
  status: P11ReadinessStatus;
  summary: string;
  workspaceScoped: boolean;
  aggregateFirst: boolean;
  mutationEnabled: false;
};

export type P11ReadinessPolicy = {
  phase: "p11";
  title: "P11 Scale / Reliability / Billing";
  readinessNotLaunch: true;
  categories: P11ReadinessCategory[];
  safety: {
    noPaymentProviderIntegration: true;
    noChargingCustomers: true;
    noInvoiceCreation: true;
    noSubscriptionMutation: true;
    noQuotaEnforcement: true;
    noCrmMutation: true;
    noOutboundSend: true;
    noRealAiProvider: true;
    noRawCustomerMessages: true;
    noRawProviderPayload: true;
    noRawWebhookPayload: true;
    noAccessToken: true;
    noRefreshToken: true;
    noCookies: true;
  };
};
