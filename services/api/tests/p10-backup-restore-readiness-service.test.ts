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

describe("P10 backup restore readiness service", () => {
  it("returns workspace-scoped readiness without executing backup or restore", () => {
    const readiness = new BackupRestoreReadinessService(
      () => new Date("2026-07-20T00:00:00.000Z"),
    ).getReadiness({ auth });

    expect(readiness).toMatchObject({
      workspaceId: "wks_test",
      generatedAt: "2026-07-20T00:00:00.000Z",
      phase: "p10",
      backupRestore: {
        backupJobImplemented: false,
        restoreJobImplemented: false,
      },
      safety: {
        readOnly: true,
        backupExecuted: false,
        restoreExecuted: false,
        dataDeleted: false,
      },
    });
  });
});
