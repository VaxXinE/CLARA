import { describe, expect, it } from "vitest";
import {
  p17AnalysisService,
  p17Auth,
  p17Scope,
} from "./p17-real-ai-analysis-service.test";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 real AI analysis unsafe snapshot rejection", () => {
  it("rejects raw unsafe extension snapshot fields before analysis", async () => {
    const snapshot = {
      ...p17Snapshot(),
      rawProviderPayload: "unsafe",
    };

    await expect(
      p17AnalysisService().analyze({
        auth: p17Auth,
        scope: p17Scope,
        snapshotId: "snap_unsafe",
        snapshot: snapshot as never,
        correlationId: "corr_unsafe",
      }),
    ).rejects.toThrow("Invalid request");
  });
});
