import { toObservabilitySloAlertReadinessDto } from "./observability-readiness-dto";
import type {
  ObservabilitySloAlertReadinessInput,
  ObservabilitySloAlertReadinessResponse,
} from "./observability-readiness-types";

export class ObservabilitySloAlertReadinessService {
  getReadiness(
    input: ObservabilitySloAlertReadinessInput,
  ): ObservabilitySloAlertReadinessResponse {
    return toObservabilitySloAlertReadinessDto(input);
  }
}
