import type { AuthContext } from "../auth/auth-context";
import { getPermissionAuditRoleBoundaries } from "./permission-audit-policy";
import type { PermissionAuditReadinessResponse } from "./permission-audit-types";

export function toPermissionAuditReadinessDto(input: {
  auth: AuthContext;
  generatedAt: Date;
}): PermissionAuditReadinessResponse {
  return {
    workspaceId: input.auth.workspaceId,
    generatedAt: input.generatedAt.toISOString(),
    phase: "p10",
    permissionAudit: {
      leastPrivilegeRequired: true,
      roleBoundaryRequired: true,
      backendAuthorizationRequired: true,
      frontendRoleGuardIsUxOnly: true,
      permissionDeniedEventsAuditable: true,
      privilegedActionReviewRequired: true,
      safeAuditMetadataOnly: true,
    },
    roleBoundaries: getPermissionAuditRoleBoundaries(),
    safety: {
      readOnly: true,
      mutationAllowed: false,
      permissionMutationAllowed: false,
      roleMutationAllowed: false,
      rawPermissionInternalsIncluded: false,
      rawAuditMetadataIncluded: false,
      secretsIncluded: false,
    },
  };
}
