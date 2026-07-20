export function getIdempotencyHardeningPolicy() {
  return {
    idempotencyKeyRequired: true,
    workspaceScopedDedupRequired: true,
    providerMessageScopedDedupRequired: true,
    replayProtectionRequired: true,
    replayExecutionImplemented: false,
  } as const;
}
