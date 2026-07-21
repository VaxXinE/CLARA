import { getPlanCatalogReadinessPolicy } from "./plan-catalog-readiness-policy";
import type { PlanCatalogReadiness } from "./plan-catalog-readiness-types";

export class PlanCatalogReadinessService {
  getReadiness(): PlanCatalogReadiness {
    return getPlanCatalogReadinessPolicy();
  }
}
