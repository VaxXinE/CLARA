import type { AuthContext } from "../auth/auth-context";
import { getAuditRetentionCategories } from "./audit-retention-readiness-policy";
import type { AuditRetentionReadinessResponse } from "./audit-retention-readiness-types";

export function toAuditRetentionReadinessDto(input: {
  auth: AuthContext;
  generatedAt: Date;
}): AuditRetentionReadinessResponse {
  return {
    workspaceId: input.auth.workspaceId,
    generatedAt: input.generatedAt.toISOString(),
    phase: "p10",
    retentionReadiness: {
      auditRetentionPolicyDefined: true,
      safeAuditMetadataOnly: true,
      rawSecretsProhibited: true,
      rawProviderPayloadProhibited: true,
      rawWebhookPayloadProhibited: true,
      deletionAutomationImplemented: false,
      legalHoldAutomationImplemented: false,
      retentionJobImplemented: false,
      exportImplemented: false,
    },
    categories: getAuditRetentionCategories(),
    safety: {
      readOnly: true,
      mutationAllowed: false,
      deletionExecuted: false,
      legalHoldExecuted: false,
      exportExecuted: false,
      rawAuditMetadataIncluded: false,
      secretsIncluded: false,
    },
  };
}
