import { toQueueJobReliabilityReadinessDto } from "./queue-job-reliability-dto";
import type {
  QueueJobReliabilityReadinessInput,
  QueueJobReliabilityReadinessResponse,
} from "./queue-job-reliability-types";

export class QueueJobReliabilityReadinessService {
  getReadiness(
    input: QueueJobReliabilityReadinessInput,
  ): QueueJobReliabilityReadinessResponse {
    return toQueueJobReliabilityReadinessDto(input);
  }
}
