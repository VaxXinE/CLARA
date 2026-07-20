import type { BackupRestoreReadinessResponse } from "./backup-restore-readiness-types";
import type { EvidenceReadinessResponse } from "./evidence-readiness-types";
import type { IncidentResponseReadinessResponse } from "./incident-response-readiness-types";

export type OperationalResilienceSummary = {
  phase: "p10";
  backupRestoreReady: boolean;
  incidentResponseReady: boolean;
  evidenceReadinessReady: boolean;
  complianceReadinessOnly: true;
  certificationClaimed: false;
  automationExecuted: false;
};

export function summarizeOperationalResilience(input: {
  backupRestore: BackupRestoreReadinessResponse;
  incidentResponse: IncidentResponseReadinessResponse;
  evidence: EvidenceReadinessResponse;
}): OperationalResilienceSummary {
  return {
    phase: "p10",
    backupRestoreReady:
      input.backupRestore.backupRestore.backupPolicyDefined &&
      input.backupRestore.backupRestore.restorePolicyDefined,
    incidentResponseReady:
      input.incidentResponse.incidentResponse.severityModelDefined &&
      input.incidentResponse.incidentResponse.containmentChecklistDefined,
    evidenceReadinessReady:
      input.evidence.evidenceReadiness.evidenceCategoriesDefined &&
      input.evidence.evidenceReadiness.safeEvidenceSummaryOnly,
    complianceReadinessOnly: true,
    certificationClaimed: false,
    automationExecuted: false,
  };
}
