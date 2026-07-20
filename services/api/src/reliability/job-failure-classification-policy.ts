export type JobFailureReasonCode =
  | "retryable_provider_failure"
  | "non_retryable_validation_failure"
  | "poison_message"
  | "rate_limited"
  | "unknown_safe_failure";

export function classifyJobFailure(input: {
  retryable: boolean;
  validationFailure?: boolean;
  poisonMessage?: boolean;
  rateLimited?: boolean;
}): JobFailureReasonCode {
  if (input.poisonMessage) {
    return "poison_message";
  }

  if (input.validationFailure) {
    return "non_retryable_validation_failure";
  }

  if (input.rateLimited) {
    return "rate_limited";
  }

  return input.retryable
    ? "retryable_provider_failure"
    : "unknown_safe_failure";
}
