import {
  getRateLimitQuotaUsageControls,
  getRateLimitReadinessPolicy,
} from "./rate-limit-readiness-policy";
import type {
  RateLimitQuotaUsageReadinessInput,
  RateLimitQuotaUsageReadinessResponse,
} from "../billing/usage-metering-readiness-types";
import { getQuotaReadinessPolicy } from "../billing/quota-readiness-policy";
import { getUsageMeteringReadinessPolicy } from "../billing/usage-metering-readiness-service";
import { buildUsageMeteringSafeSummary } from "../billing/usage-metering-safe-summary";
import { buildBillingSafeMetadataBoundary } from "../billing/billing-safe-metadata-boundary";

export function toRateLimitQuotaUsageReadinessDto(
  input: RateLimitQuotaUsageReadinessInput,
): RateLimitQuotaUsageReadinessResponse {
  return {
    workspaceId: input.auth.workspaceId,
    generatedAt: (input.generatedAt ?? new Date()).toISOString(),
    phase: "p11",
    rateLimitReadiness: getRateLimitReadinessPolicy(),
    quotaReadiness: getQuotaReadinessPolicy(),
    usageMeteringReadiness: getUsageMeteringReadinessPolicy(),
    controls: getRateLimitQuotaUsageControls(),
    usageSummary: buildUsageMeteringSafeSummary(),
    billingMetadataBoundary: buildBillingSafeMetadataBoundary(),
    safety: {
      readOnly: true,
      mutationAllowed: false,
      quotaEnforced: false,
      quotaMutated: false,
      usageCounterMutated: false,
      subscriptionMutated: false,
      planMutated: false,
      entitlementMutated: false,
      customerCharged: false,
      invoiceCreated: false,
      paymentProviderCalled: false,
      secretsIncluded: false,
    },
  };
}
