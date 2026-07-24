import { describe, expect, it } from "vitest";
import {
  p17AnalysisService,
  p17Auth,
} from "./p17-real-ai-analysis-service.test";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 real AI analysis cross-workspace regression", () => {
  it("rejects mismatched AuthContext and workspace scope", async () => {
    await expect(
      p17AnalysisService().analyze({
        auth: p17Auth,
        scope: { organizationId: "org_1", workspaceId: "wks_other" },
        snapshotId: "snap_cross",
        snapshot: p17Snapshot(),
        correlationId: "corr_cross",
      }),
    ).rejects.toThrow("Invalid request");
  });
});
