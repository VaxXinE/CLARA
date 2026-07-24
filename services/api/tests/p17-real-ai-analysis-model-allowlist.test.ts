import { describe, expect, it } from "vitest";
import {
  p17AnalysisService,
  p17Auth,
  p17Scope,
} from "./p17-real-ai-analysis-service.test";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 real AI analysis model allowlist", () => {
  it("blocks unallowlisted models", async () => {
    const result = await p17AnalysisService().analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_model",
      snapshot: p17Snapshot(),
      model: "blocked-model",
      correlationId: "corr_model",
    });

    expect(result.data.analysis.safeReasonCode).toBe(
      "ai_model_not_allowlisted",
    );
  });
});
