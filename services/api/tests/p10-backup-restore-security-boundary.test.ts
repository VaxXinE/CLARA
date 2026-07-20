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

describe("P10 backup restore security boundary", () => {
  it("does not expose secrets or raw evidence", () => {
    const output = JSON.stringify(
      new BackupRestoreReadinessService().getReadiness({ auth }),
    );

    for (const forbidden of [
      "atk",
      "rtk",
      "Bearer ",
      "client secret value",
      "raw customer body",
      "provider raw body",
      "webhook raw body",
    ]) {
      expect(output).not.toContain(forbidden);
    }
  });
});
