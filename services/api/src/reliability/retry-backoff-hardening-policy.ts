export function getRetryBackoffHardeningPolicy() {
  return {
    boundedRetriesRequired: true,
    exponentialBackoffRequired: true,
    jitterRequired: true,
    maxAttemptsRequired: true,
    providerRateLimitRespectRequired: true,
    retryExecutionImplemented: false,
  } as const;
}
