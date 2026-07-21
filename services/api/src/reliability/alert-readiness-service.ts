import { getAlertReadinessPolicy } from "./alert-readiness-policy";
import type { AlertReadiness } from "./alert-readiness-types";

export class AlertReadinessService {
  getReadiness(): AlertReadiness {
    return getAlertReadinessPolicy();
  }
}
