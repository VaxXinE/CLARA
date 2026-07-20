import type { BackupRestoreControl } from "./backup-restore-readiness-types";

export const backupRestoreControls: BackupRestoreControl[] = [
  {
    controlKey: "backup_policy",
    label: "Backup policy",
    description:
      "Backup ownership, scope, and storage expectations are defined.",
    status: "ready",
    severity: "critical",
    evidenceType: "policy",
  },
  {
    controlKey: "restore_policy",
    label: "Restore policy",
    description: "Restore approval and validation expectations are defined.",
    status: "ready",
    severity: "critical",
    evidenceType: "runbook",
  },
  {
    controlKey: "recovery_objectives",
    label: "Recovery objectives",
    description: "RPO/RTO placeholders exist for production planning.",
    status: "ready",
    severity: "warning",
    evidenceType: "checklist",
  },
  {
    controlKey: "automation_boundary",
    label: "Automation boundary",
    description:
      "No backup or restore job is executed by this readiness surface.",
    status: "ready",
    severity: "critical",
    evidenceType: "test",
  },
];

export function getBackupRestoreControls(): BackupRestoreControl[] {
  return backupRestoreControls;
}
