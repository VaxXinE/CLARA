import { describe, expect, it } from "vitest";
import type { AuthContext } from "../src/auth/auth-context";
import { BackupRestoreReadinessService } from "../src/enterprise/backup-restore-readiness-service";

const auth: AuthContext = {
  userId: "usr_test",
  organizationId: "org_test",
  workspaceId: "wks_test",
  role: "owner",
  permissions: [],
  authMethod: "mock",
};

describe("P10 backup restore no execution regression", () => {
  it("does not execute backup, restore, or destructive operations", () => {
    const readiness = new BackupRestoreReadinessService().getReadiness({
      auth,
    });

    expect(readiness.backupRestore.automatedBackupImplemented).toBe(false);
    expect(readiness.backupRestore.automatedRestoreImplemented).toBe(false);
    expect(readiness.backupRestore.destructiveOperationAllowed).toBe(false);
    expect(readiness.safety.backupExecuted).toBe(false);
    expect(readiness.safety.restoreExecuted).toBe(false);
    expect(readiness.safety.dataDeleted).toBe(false);
  });
});
