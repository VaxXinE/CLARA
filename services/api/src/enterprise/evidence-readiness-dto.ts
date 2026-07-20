import type { AuthContext } from "../auth/auth-context";
import { getEvidenceReadinessCategories } from "./evidence-readiness-policy";
import type { EvidenceReadinessResponse } from "./evidence-readiness-types";

export function toEvidenceReadinessDto(input: {
  auth: AuthContext;
  generatedAt: Date;
}): EvidenceReadinessResponse {
  return {
    workspaceId: input.auth.workspaceId,
    generatedAt: input.generatedAt.toISOString(),
    phase: "p10",
    evidenceReadiness: {
      evidenceCategoriesDefined: true,
      safeEvidenceSummaryOnly: true,
      rawEvidenceBrowsingImplemented: false,
      evidenceExportImplemented: false,
      evidenceDownloadImplemented: false,
      certificationClaimed: false,
      auditTrailLinked: true,
      retentionPolicyLinked: true,
    },
    categories: getEvidenceReadinessCategories(),
    safety: {
      readOnly: true,
      exportEnabled: false,
      downloadEnabled: false,
      rawEvidenceIncluded: false,
      rawAuditMetadataIncluded: false,
      secretsIncluded: false,
      certificationClaimed: false,
    },
  };
}
