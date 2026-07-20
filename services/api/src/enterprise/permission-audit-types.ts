import type { Role } from "../auth/permissions";

export type PermissionAuditRoleBoundary = {
  role: Role;
  allowedSurfaceKeys: string[];
  deniedSurfaceKeys: string[];
  auditRequiredForDeniedAccess: true;
  mutationAllowed: false;
};

export type PermissionAuditReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  permissionAudit: {
    leastPrivilegeRequired: true;
    roleBoundaryRequired: true;
    backendAuthorizationRequired: true;
    frontendRoleGuardIsUxOnly: true;
    permissionDeniedEventsAuditable: true;
    privilegedActionReviewRequired: true;
    safeAuditMetadataOnly: true;
  };
  roleBoundaries: PermissionAuditRoleBoundary[];
  safety: {
    readOnly: true;
    mutationAllowed: false;
    permissionMutationAllowed: false;
    roleMutationAllowed: false;
    rawPermissionInternalsIncluded: false;
    rawAuditMetadataIncluded: false;
    secretsIncluded: false;
  };
};
