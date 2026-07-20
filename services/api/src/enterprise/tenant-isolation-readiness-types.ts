export type EnterpriseReadinessStatus = "ready" | "warning" | "blocked";
export type EnterpriseReadinessSeverity = "info" | "warning" | "critical";
export type EnterpriseReadinessEvidenceType =
  | "policy"
  | "test"
  | "runtime_guardrail"
  | "dashboard_boundary"
  | "extension_boundary";

export type TenantIsolationReadinessCheck = {
  checkKey: string;
  label: string;
  description: string;
  status: EnterpriseReadinessStatus;
  severity: EnterpriseReadinessSeverity;
  evidenceType: EnterpriseReadinessEvidenceType;
};

export type TenantIsolationReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  readiness: {
    backendAuthContextSourceOfTruth: true;
    clientWorkspaceIdAuthoritative: false;
    workspaceScopedReadsRequired: true;
    workspaceScopedWritesRequired: true;
    crossWorkspaceAccessDenied: true;
    safeErrorBehaviorRequired: true;
    auditOnBoundaryViolationRequired: true;
    dashboardUxBoundaryRequired: true;
    extensionBoundaryRequired: true;
  };
  checks: TenantIsolationReadinessCheck[];
  safety: {
    readOnly: true;
    mutationAllowed: false;
    rawTenantDataIncluded: false;
    rawCustomerMessagesIncluded: false;
    rawProviderPayloadIncluded: false;
    rawWebhookPayloadIncluded: false;
    rawAuditMetadataIncluded: false;
    secretsIncluded: false;
  };
};
