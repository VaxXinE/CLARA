export type ComplianceDashboardStatus =
  "ready" | "in_progress" | "planned" | "blocked";
export type ComplianceDashboardRiskLevel =
  "low" | "medium" | "high" | "critical";

export type ComplianceDashboardCategory = {
  categoryKey: string;
  label: string;
  description: string;
  status: ComplianceDashboardStatus;
  riskLevel: ComplianceDashboardRiskLevel;
  safeEvidenceSummary: string;
};

export type ComplianceDashboardResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  readinessSummary: {
    enterpriseScopeReady: true;
    tenantIsolationReady: true;
    permissionAuditReady: true;
    auditRetentionReady: true;
    dataClassificationReady: true;
    redactionHardeningReady: true;
    adminSecurityControlsReady: true;
    sessionPolicyReady: true;
    evidenceReadinessImplemented: true;
    incidentResponseImplemented: true;
    backupRestoreImplemented: true;
    finalP10AuditImplemented: true;
  };
  categories: ComplianceDashboardCategory[];
  safety: {
    readOnly: true;
    exportEnabled: false;
    evidenceDownloadEnabled: false;
    rawEvidenceIncluded: false;
    rawAuditMetadataIncluded: false;
    secretsIncluded: false;
    certificationClaimed: false;
  };
};
