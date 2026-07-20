export type RetentionIntent =
  "retain_for_audit" | "minimize" | "future_retention_review";

export type ComplianceDataClassification =
  "public" | "internal" | "confidential" | "restricted" | "secret";

export type AuditRetentionCategory = {
  categoryKey: string;
  label: string;
  description: string;
  retentionIntent: RetentionIntent;
  dataClassification: ComplianceDataClassification;
  rawSensitiveDataAllowed: false;
  redactionRequired: true;
};

export type AuditRetentionReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  retentionReadiness: {
    auditRetentionPolicyDefined: true;
    safeAuditMetadataOnly: true;
    rawSecretsProhibited: true;
    rawProviderPayloadProhibited: true;
    rawWebhookPayloadProhibited: true;
    deletionAutomationImplemented: false;
    legalHoldAutomationImplemented: false;
    retentionJobImplemented: false;
    exportImplemented: false;
  };
  categories: AuditRetentionCategory[];
  safety: {
    readOnly: true;
    mutationAllowed: false;
    deletionExecuted: false;
    legalHoldExecuted: false;
    exportExecuted: false;
    rawAuditMetadataIncluded: false;
    secretsIncluded: false;
  };
};
