export type AdminSecurityControlStatus = "ready" | "planned" | "blocked";
export type AdminSecurityControlSeverity = "info" | "warning" | "critical";
export type AdminSecurityEvidenceType =
  "policy" | "test" | "runtime_guardrail" | "dashboard_boundary";

export type AdminSecurityControl = {
  controlKey: string;
  label: string;
  description: string;
  status: AdminSecurityControlStatus;
  severity: AdminSecurityControlSeverity;
  evidenceType: AdminSecurityEvidenceType;
};

export type AdminSecurityControlsReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  adminSecurity: {
    backendAuthorizationRequired: true;
    leastPrivilegeRequired: true;
    privilegedActionAuditRequired: true;
    frontendRoleGuardIsUxOnly: true;
    roleMutationImplemented: false;
    permissionMutationImplemented: false;
    ssoImplemented: false;
    mfaImplemented: false;
    emergencyAccessPolicyDefined: true;
    adminActionReviewRequired: true;
  };
  controls: AdminSecurityControl[];
  safety: {
    readOnly: true;
    mutationAllowed: false;
    roleMutationAllowed: false;
    permissionMutationAllowed: false;
    rawPermissionInternalsIncluded: false;
    secretsIncluded: false;
  };
};
