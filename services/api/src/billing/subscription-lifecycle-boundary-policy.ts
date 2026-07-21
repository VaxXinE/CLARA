import type { SubscriptionLifecycleBoundary } from "./billing-readiness-types";

export function getSubscriptionLifecycleBoundaryPolicy(): SubscriptionLifecycleBoundary {
  return {
    lifecyclePolicyDefined: true,
    checkoutImplemented: false,
    renewalImplemented: false,
    cancellationImplemented: false,
    prorationImplemented: false,
    taxLogicImplemented: false,
  };
}
