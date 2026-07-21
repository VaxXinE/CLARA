import { toPerformanceCapacityReadinessDto } from "./performance-readiness-dto";
import type {
  PerformanceCapacityReadinessResponse,
  PerformanceReadinessInput,
} from "./performance-readiness-types";

export class PerformanceCapacityReadinessService {
  getReadiness(
    input: PerformanceReadinessInput,
  ): PerformanceCapacityReadinessResponse {
    return toPerformanceCapacityReadinessDto(input);
  }
}
