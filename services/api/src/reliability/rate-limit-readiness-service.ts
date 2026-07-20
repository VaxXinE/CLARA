import { toRateLimitQuotaUsageReadinessDto } from "./rate-limit-readiness-dto";
import type {
  RateLimitQuotaUsageReadinessInput,
  RateLimitQuotaUsageReadinessResponse,
} from "../billing/usage-metering-readiness-types";

export class RateLimitQuotaUsageReadinessService {
  getReadiness(
    input: RateLimitQuotaUsageReadinessInput,
  ): RateLimitQuotaUsageReadinessResponse {
    return toRateLimitQuotaUsageReadinessDto(input);
  }
}
