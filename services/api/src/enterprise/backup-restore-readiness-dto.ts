import type { AuthContext } from "../auth/auth-context";
import { getBackupRestoreControls } from "./backup-restore-readiness-policy";
import type { BackupRestoreReadinessResponse } from "./backup-restore-readiness-types";

export function toBackupRestoreReadinessDto(input: {
  auth: AuthContext;
  generatedAt: Date;
}): BackupRestoreReadinessResponse {
  return {
    workspaceId: input.auth.workspaceId,
    generatedAt: input.generatedAt.toISOString(),
    phase: "p10",
    backupRestore: {
      backupPolicyDefined: true,
      restorePolicyDefined: true,
      recoveryObjectiveDefined: true,
      restoreTestReadinessDefined: true,
      backupJobImplemented: false,
      restoreJobImplemented: false,
      automatedBackupImplemented: false,
      automatedRestoreImplemented: false,
      destructiveOperationAllowed: false,
    },
    controls: getBackupRestoreControls(),
    safety: {
      readOnly: true,
      mutationAllowed: false,
      backupExecuted: false,
      restoreExecuted: false,
      dataDeleted: false,
      secretsIncluded: false,
      rawEvidenceIncluded: false,
    },
  };
}
