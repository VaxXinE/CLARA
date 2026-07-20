export type EvidenceClassification = "internal" | "confidential" | "restricted";
export type EvidenceSource =
  | "policy"
  | "test_result"
  | "runbook"
  | "runtime_guardrail"
  | "dashboard_boundary"
  | "extension_boundary";

export type EvidenceReadinessCategory = {
  categoryKey: string;
  label: string;
  description: string;
  classification: EvidenceClassification;
  evidenceSource: EvidenceSource;
  rawEvidenceIncluded: false;
  exportAllowed: false;
};

export type EvidenceReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  evidenceReadiness: {
    evidenceCategoriesDefined: true;
    safeEvidenceSummaryOnly: true;
    rawEvidenceBrowsingImplemented: false;
    evidenceExportImplemented: false;
    evidenceDownloadImplemented: false;
    certificationClaimed: false;
    auditTrailLinked: true;
    retentionPolicyLinked: true;
  };
  categories: EvidenceReadinessCategory[];
  safety: {
    readOnly: true;
    exportEnabled: false;
    downloadEnabled: false;
    rawEvidenceIncluded: false;
    rawAuditMetadataIncluded: false;
    secretsIncluded: false;
    certificationClaimed: false;
  };
};
