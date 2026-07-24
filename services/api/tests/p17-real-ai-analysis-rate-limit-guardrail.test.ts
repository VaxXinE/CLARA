import { describe, expect, it } from "vitest";
import {
  p17AnalysisService,
  p17Auth,
  p17Scope,
} from "./p17-real-ai-analysis-service.test";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 real AI analysis rate limit guardrail", () => {
  it("blocks excessive analysis attempts", async () => {
    const result = await p17AnalysisService().analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_rate",
      snapshot: p17Snapshot(),
      correlationId: "corr_rate",
      attemptedAnalysisCount: 21,
    });

    expect(result.data.analysis.safeReasonCode).toBe("ai_rate_limit_exceeded");
  });
});
