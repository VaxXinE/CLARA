import type { P11ReadinessPolicy } from "../reliability/scale-reliability-readiness-types";
import { getP11ScaleReliabilityScopePolicy } from "../reliability/p11-scale-reliability-scope-policy";

export function getBillingReadinessBoundaryPolicy(): P11ReadinessPolicy {
  return {
    ...getP11ScaleReliabilityScopePolicy(),
    categories: [
      {
        key: "billing_readiness",
        label: "Billing readiness boundary",
        status: "planned",
        summary:
          "Billing readiness only: no payment provider integration, no charging customers, no invoice creation, no subscription mutation, and no quota enforcement.",
        workspaceScoped: true,
        aggregateFirst: true,
        mutationEnabled: false,
      },
    ],
  };
}
