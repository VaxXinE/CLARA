export function getDeadLetterReadinessPolicy() {
  return {
    deadLetterStateRequired: true,
    poisonMessageClassificationRequired: true,
    safeOperatorReviewRequired: true,
    purgeImplemented: false,
  } as const;
}
