import type { AuthContext } from "../auth/auth-context";
import { getComplianceDashboardCategories } from "./compliance-dashboard-policy";
import type { ComplianceDashboardResponse } from "./compliance-dashboard-types";

export function toComplianceDashboardDto(input: {
  auth: AuthContext;
  generatedAt: Date;
}): ComplianceDashboardResponse {
  return {
    workspaceId: input.auth.workspaceId,
    generatedAt: input.generatedAt.toISOString(),
    phase: "p10",
    readinessSummary: {
      enterpriseScopeReady: true,
      tenantIsolationReady: true,
      permissionAuditReady: true,
      auditRetentionReady: true,
      dataClassificationReady: true,
      redactionHardeningReady: true,
      adminSecurityControlsReady: true,
      sessionPolicyReady: true,
      evidenceReadinessImplemented: true,
      incidentResponseImplemented: true,
      backupRestoreImplemented: true,
      finalP10AuditImplemented: false,
    },
    categories: getComplianceDashboardCategories(),
    safety: {
      readOnly: true,
      exportEnabled: false,
      evidenceDownloadEnabled: false,
      rawEvidenceIncluded: false,
      rawAuditMetadataIncluded: false,
      secretsIncluded: false,
      certificationClaimed: false,
    },
  };
}
