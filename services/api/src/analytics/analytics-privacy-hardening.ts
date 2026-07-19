import { analyticsPolicyVersion } from "./analytics-metric-types";

export function getAnalyticsPrivacyHardening() {
  return {
    aggregated: true,
    workspaceScoped: true,
    rawPayloadIncluded: false,
    rawCustomerMessagesIncluded: false,
    rawProviderPayloadIncluded: false,
    rawWebhookPayloadIncluded: false,
    rawAuditMetadataIncluded: false,
    piiMinimized: true,
    policyVersion: analyticsPolicyVersion,
  } as const;
}

export function getAnalyticsReadOnlySafety(auditEventWritten: boolean) {
  return {
    readOnly: true,
    exportEnabled: false,
    drilldownEnabled: false,
    mutationAllowed: false,
    auditEventWritten,
    crmMutationExecuted: false,
    taskCreated: false,
    customerNoteWritten: false,
    ownerAssigned: false,
    lifecycleStatusUpdated: false,
    outboundSent: false,
  } as const;
}
