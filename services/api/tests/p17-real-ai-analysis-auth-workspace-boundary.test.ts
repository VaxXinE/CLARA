import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import {
  p17AnalysisService,
  p17Auth,
} from "./p17-real-ai-analysis-service.test";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 real AI analysis AuthContext workspace boundary", () => {
  it("blocks viewer and rejects client workspace authority", async () => {
    await expect(
      p17AnalysisService().analyze({
        auth: buildAuthContext({
          ...p17Auth,
          role: "viewer",
        }),
        scope: { organizationId: "org_1", workspaceId: "wks_1" },
        snapshotId: "snap_viewer",
        snapshot: p17Snapshot(),
        correlationId: "corr_viewer",
      }),
    ).rejects.toThrow("permission");

    await expect(
      p17AnalysisService().analyze({
        auth: p17Auth,
        scope: { organizationId: "org_1", workspaceId: "wks_1" },
        snapshotId: "snap_spoof",
        snapshot: p17Snapshot(),
        clientWorkspaceId: "wks_other",
        correlationId: "corr_spoof",
      }),
    ).rejects.toThrow("Invalid request");
  });
});
