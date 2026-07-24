import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import {
  p17AnalysisService,
  p17Auth,
  p17Scope,
} from "./p17-real-ai-analysis-service.test";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 final AI AuthContext workspace boundary", () => {
  it("uses backend AuthContext and rejects viewer/client workspace authority", async () => {
    await expect(
      p17AnalysisService().analyze({
        auth: buildAuthContext({ ...p17Auth, role: "viewer" }),
        scope: p17Scope,
        snapshotId: "snap_final_viewer",
        snapshot: p17Snapshot(),
        correlationId: "corr_final_viewer",
      }),
    ).rejects.toThrow("permission");

    await expect(
      p17AnalysisService().analyze({
        auth: p17Auth,
        scope: p17Scope,
        snapshotId: "snap_final_spoof",
        snapshot: p17Snapshot(),
        clientWorkspaceId: "wks_not_authority",
        correlationId: "corr_final_spoof",
      }),
    ).rejects.toThrow("Invalid request");
  });
});
