export type RedactionAction = "redact" | "block" | "classify";
export type RedactionSeverity = "info" | "warning" | "critical";

export type RedactionClassifierRule = {
  classifierKey: string;
  label: string;
  detects: string[];
  action: RedactionAction;
  severity: RedactionSeverity;
};

export type RedactionHardeningReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  redaction: {
    tokenRedactionRequired: true;
    cookieRedactionRequired: true;
    authHeaderRedactionRequired: true;
    apiKeyRedactionRequired: true;
    providerPayloadRedactionRequired: true;
    webhookPayloadRedactionRequired: true;
    auditMetadataRedactionRequired: true;
    customerMessageRedactionRequiredForComplianceViews: true;
  };
  classifiers: RedactionClassifierRule[];
  safety: {
    readOnly: true;
    mutationAllowed: false;
    rawBeforeAfterSamplesIncluded: false;
    secretsIncluded: false;
  };
};
