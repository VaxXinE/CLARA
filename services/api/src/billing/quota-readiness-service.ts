import { getQuotaReadinessPolicy } from "./quota-readiness-policy";
import type { QuotaReadiness } from "./quota-readiness-types";

export class QuotaReadinessService {
  getReadiness(): QuotaReadiness {
    return getQuotaReadinessPolicy();
  }
}
