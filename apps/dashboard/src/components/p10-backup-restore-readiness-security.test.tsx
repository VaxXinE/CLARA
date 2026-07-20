import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BackupRestoreReadinessPanel } from "./BackupRestoreReadinessPanel";

describe("P10 backup restore readiness dashboard security", () => {
  it("does not render execution or secret controls", () => {
    render(
      <BackupRestoreReadinessPanel
        readiness={null}
        loading={false}
        error={null}
      />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    for (const forbidden of [/run backup/i, /run restore/i, /delete data/i]) {
      expect(screen.queryByText(forbidden)).not.toBeInTheDocument();
    }
  });
});
