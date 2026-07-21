import { toBillingPlanEntitlementReadinessDto } from "./billing-readiness-dto";
import type {
  BillingPlanEntitlementReadinessInput,
  BillingPlanEntitlementReadinessResponse,
} from "./billing-readiness-types";

export class BillingPlanEntitlementReadinessService {
  getReadiness(
    input: BillingPlanEntitlementReadinessInput,
  ): BillingPlanEntitlementReadinessResponse {
    return toBillingPlanEntitlementReadinessDto(input);
  }
}
