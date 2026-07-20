import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { BackupRestoreReadinessResponse } from "../api/types";
import { BackupRestoreReadinessPanel } from "./BackupRestoreReadinessPanel";

const readiness: BackupRestoreReadinessResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T00:00:00.000Z",
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
  controls: [
    {
      controlKey: "backup_policy",
      label: "Backup policy",
      description: "Backup ownership is defined.",
      status: "ready",
      severity: "critical",
      evidenceType: "policy",
    },
  ],
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

describe("BackupRestoreReadinessPanel", () => {
  it("renders safe backup restore readiness without execution controls", () => {
    render(
      <BackupRestoreReadinessPanel
        readiness={readiness}
        loading={false}
        error={null}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Backup Restore Readiness" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Backup policy")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByText(/access token/i)).not.toBeInTheDocument();
  });
});
