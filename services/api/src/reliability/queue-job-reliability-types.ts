import type { AuthContext } from "../auth/auth-context";

export type QueueJobReadinessStatus = "ready" | "planned" | "blocked";
export type QueueJobReadinessSeverity = "info" | "warning" | "critical";
export type QueueJobEvidenceType =
  | "policy"
  | "test"
  | "runbook"
  | "runtime_guardrail"
  | "dashboard_boundary"
  | "extension_boundary";

export type QueueJobReliabilityControl = {
  controlKey: string;
  label: string;
  description: string;
  status: QueueJobReadinessStatus;
  severity: QueueJobReadinessSeverity;
  evidenceType: QueueJobEvidenceType;
};

export type QueueJobReliabilityReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p11";
  queueJobReliability: {
    queueReliabilityPolicyDefined: true;
    retryPolicyDefined: true;
    idempotencyPolicyDefined: true;
    deadLetterReadinessDefined: true;
    failureClassificationDefined: true;
    workerImplemented: false;
    jobExecutionImplemented: false;
    autoRetryExecutionImplemented: false;
    destructiveCleanupImplemented: false;
  };
  controls: QueueJobReliabilityControl[];
  retryBackoff: {
    boundedRetriesRequired: true;
    exponentialBackoffRequired: true;
    jitterRequired: true;
    maxAttemptsRequired: true;
    providerRateLimitRespectRequired: true;
    retryExecutionImplemented: false;
  };
  idempotency: {
    idempotencyKeyRequired: true;
    workspaceScopedDedupRequired: true;
    providerMessageScopedDedupRequired: true;
    replayProtectionRequired: true;
    replayExecutionImplemented: false;
  };
  deadLetter: {
    deadLetterStateRequired: true;
    poisonMessageClassificationRequired: true;
    safeOperatorReviewRequired: true;
    purgeImplemented: false;
  };
  safety: {
    readOnly: true;
    workspaceScoped: true;
    clientScopeIgnored: true;
    mutationAllowed: false;
    jobEnqueueAllowed: false;
    jobExecutionAllowed: false;
    retryExecutionAllowed: false;
    replayAllowed: false;
    purgeAllowed: false;
    rawJobPayloadIncluded: false;
    rawCustomerMessagesIncluded: false;
    rawProviderPayloadIncluded: false;
    rawWebhookPayloadIncluded: false;
    outboundSendAllowed: false;
    billingSideEffectsAllowed: false;
    aiProviderCallAllowed: false;
  };
};

export type QueueJobReliabilityReadinessInput = {
  auth: AuthContext;
  generatedAt?: Date;
};
