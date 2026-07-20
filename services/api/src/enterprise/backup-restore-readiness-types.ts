export type BackupRestoreControlStatus = "ready" | "planned" | "blocked";
export type BackupRestoreControlSeverity = "info" | "warning" | "critical";
export type BackupRestoreEvidenceType =
  "policy" | "checklist" | "runbook" | "test" | "dashboard_boundary";

export type BackupRestoreControl = {
  controlKey: string;
  label: string;
  description: string;
  status: BackupRestoreControlStatus;
  severity: BackupRestoreControlSeverity;
  evidenceType: BackupRestoreEvidenceType;
};

export type BackupRestoreReadinessResponse = {
  workspaceId: string;
  generatedAt: string;
  phase: "p10";
  backupRestore: {
    backupPolicyDefined: true;
    restorePolicyDefined: true;
    recoveryObjectiveDefined: true;
    restoreTestReadinessDefined: true;
    backupJobImplemented: false;
    restoreJobImplemented: false;
    automatedBackupImplemented: false;
    automatedRestoreImplemented: false;
    destructiveOperationAllowed: false;
  };
  controls: BackupRestoreControl[];
  safety: {
    readOnly: true;
    mutationAllowed: false;
    backupExecuted: false;
    restoreExecuted: false;
    dataDeleted: false;
    secretsIncluded: false;
    rawEvidenceIncluded: false;
  };
};
