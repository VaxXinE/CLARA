import type { AuthContext } from "../auth/auth-context";
import { getAdminSecurityControls } from "./admin-security-controls-policy";
import type { AdminSecurityControlsReadinessResponse } from "./admin-security-controls-types";

export function toAdminSecurityControlsReadinessDto(input: {
  auth: AuthContext;
  generatedAt: Date;
}): AdminSecurityControlsReadinessResponse {
  return {
    workspaceId: input.auth.workspaceId,
    generatedAt: input.generatedAt.toISOString(),
    phase: "p10",
    adminSecurity: {
      backendAuthorizationRequired: true,
      leastPrivilegeRequired: true,
      privilegedActionAuditRequired: true,
      frontendRoleGuardIsUxOnly: true,
      roleMutationImplemented: false,
      permissionMutationImplemented: false,
      ssoImplemented: false,
      mfaImplemented: false,
      emergencyAccessPolicyDefined: true,
      adminActionReviewRequired: true,
    },
    controls: getAdminSecurityControls(),
    safety: {
      readOnly: true,
      mutationAllowed: false,
      roleMutationAllowed: false,
      permissionMutationAllowed: false,
      rawPermissionInternalsIncluded: false,
      secretsIncluded: false,
    },
  };
}
