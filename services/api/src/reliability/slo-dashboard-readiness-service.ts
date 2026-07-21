import { getSloDashboardReadinessPolicy } from "./slo-dashboard-readiness-policy";
import type { SloDashboardReadiness } from "./slo-dashboard-readiness-types";

export class SloDashboardReadinessService {
  getReadiness(): SloDashboardReadiness {
    return getSloDashboardReadinessPolicy();
  }
}
