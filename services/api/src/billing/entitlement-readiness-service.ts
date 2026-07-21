import { getEntitlementReadinessPolicy } from "./entitlement-readiness-policy";
import type { EntitlementReadiness } from "./entitlement-readiness-types";

export class EntitlementReadinessService {
  getReadiness(): EntitlementReadiness {
    return getEntitlementReadinessPolicy();
  }
}
