import { describe, expect, it } from "vitest";
import { getBackupRestoreControls } from "../src/enterprise/backup-restore-readiness-policy";

describe("P10 backup restore readiness policy", () => {
  it("defines backup, restore, and automation boundary controls", () => {
    const keys = getBackupRestoreControls().map(
      (control) => control.controlKey,
    );

    expect(keys).toContain("backup_policy");
    expect(keys).toContain("restore_policy");
    expect(keys).toContain("automation_boundary");
  });
});
