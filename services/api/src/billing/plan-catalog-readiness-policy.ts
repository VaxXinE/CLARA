import type { PlanCatalogReadiness } from "./plan-catalog-readiness-types";

export function getPlanCatalogReadinessPolicy(): PlanCatalogReadiness {
  return {
    planCatalogPolicyDefined: true,
    planComparisonDefined: true,
    planMutationImplemented: false,
    upgradeImplemented: false,
    downgradeImplemented: false,
    cancellationImplemented: false,
  };
}
