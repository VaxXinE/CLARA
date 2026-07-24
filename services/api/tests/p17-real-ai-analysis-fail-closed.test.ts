import { describe, expect, it } from "vitest";
import {
  p17AnalysisService,
  p17Auth,
  p17Scope,
} from "./p17-real-ai-analysis-service.test";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 real AI analysis fail-closed policy", () => {
  it("fails closed when provider config is disabled or invalid", async () => {
    const disabled = await p17AnalysisService({ mode: "disabled" }).analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_disabled",
      snapshot: p17Snapshot(),
      correlationId: "corr_1",
    });
    expect(disabled.data.analysis.safeReasonCode).toBe("ai_provider_disabled");

    const invalid = await p17AnalysisService({ modelAllowlist: [] }).analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_invalid",
      snapshot: p17Snapshot(),
      correlationId: "corr_2",
    });
    expect(invalid.data.analysis.safeReasonCode).toBe(
      "ai_provider_config_invalid",
    );
  });
});
