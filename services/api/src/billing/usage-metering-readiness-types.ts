import type { RateLimitQuotaUsageControl } from "../reliability/rate-limit-readiness-types";
import type { AuthContext } from "../auth/auth-context";
import type { QuotaReadiness } from "./quota-readiness-types";
import type { RateLimitReadiness } from "../reliability/rate-limit-readiness-types";

export type UsageMeteringReadiness = {
  aggregateUsageDefined: true;
  workspaceScopedUsageDefined: true;
  billingSafeMetadataDefined: true;
  rawUsageEventsExposed: false;
  customerLevelDrilldownImplemented: false;
  invoiceCreationImplemented: false;
  chargingImplemented: false;
};

export type UsageMeteringSafeSummary = {
  aggregateOnly: true;
  workspaceScoped: true;
  rawUsageEventsIncluded: false;
  rawCustomerMessagesIncluded: false;
  rawProviderPayloadIncluded: false;
  rawWebhookPayloadIncluded: false;
  safeBillingMetadataOnly: true;
};

export type BillingSafeMetadataBoundary = {
  providerNamesAllowed: true;
  planCodeAllowed: true;
  workspaceIdAllowed: true;
  aggregateCountersAllowed: true;
  rawUsageEventsAllowed: false;
  rawCustomerMessagesAllowed: false;
  rawProviderPayloadAllowed: false;
  rawWebhookPayloadAllowed: false;
  paymentCredentialsAllowed: false;
};

export type RateLimitQuotaUsageReadinessInput = {
  auth: AuthContext;
  generatedAt?: Date;
};

export type RateLimitQuotaUsageReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p11";
  rateLimitReadiness: RateLimitReadiness;
  quotaReadiness: QuotaReadiness;
  usageMeteringReadiness: UsageMeteringReadiness;
  controls: RateLimitQuotaUsageControl[];
  usageSummary: UsageMeteringSafeSummary;
  billingMetadataBoundary: BillingSafeMetadataBoundary;
  safety: {
    readOnly: true;
    mutationAllowed: false;
    quotaEnforced: false;
    quotaMutated: false;
    usageCounterMutated: false;
    subscriptionMutated: false;
    planMutated: false;
    entitlementMutated: false;
    customerCharged: false;
    invoiceCreated: false;
    paymentProviderCalled: false;
    secretsIncluded: false;
  };
};
