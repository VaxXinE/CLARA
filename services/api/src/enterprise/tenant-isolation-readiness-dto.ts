import type { AuthContext } from "../auth/auth-context";
import { getTenantIsolationReadinessChecks } from "./tenant-isolation-readiness-policy";
import type { TenantIsolationReadinessResponse } from "./tenant-isolation-readiness-types";

export function toTenantIsolationReadinessDto(input: {
  auth: AuthContext;
  generatedAt: Date;
}): TenantIsolationReadinessResponse {
  return {
    workspaceId: input.auth.workspaceId,
    generatedAt: input.generatedAt.toISOString(),
    phase: "p10",
    readiness: {
      backendAuthContextSourceOfTruth: true,
      clientWorkspaceIdAuthoritative: false,
      workspaceScopedReadsRequired: true,
      workspaceScopedWritesRequired: true,
      crossWorkspaceAccessDenied: true,
      safeErrorBehaviorRequired: true,
      auditOnBoundaryViolationRequired: true,
      dashboardUxBoundaryRequired: true,
      extensionBoundaryRequired: true,
    },
    checks: getTenantIsolationReadinessChecks(),
    safety: {
      readOnly: true,
      mutationAllowed: false,
      rawTenantDataIncluded: false,
      rawCustomerMessagesIncluded: false,
      rawProviderPayloadIncluded: false,
      rawWebhookPayloadIncluded: false,
      rawAuditMetadataIncluded: false,
      secretsIncluded: false,
    },
  };
}
