import { describe, expect, it } from "vitest";
import {
  p17AnalysisService,
  p17Auth,
  p17Scope,
} from "./p17-real-ai-analysis-service.test";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 final AI provider fail-closed regression", () => {
  it("blocks disabled and invalid provider config without provider secrets", async () => {
    const disabled = await p17AnalysisService({ mode: "disabled" }).analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_final_disabled",
      snapshot: p17Snapshot(),
      correlationId: "corr_final_disabled",
    });
    const invalid = await p17AnalysisService({ modelAllowlist: [] }).analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_final_invalid",
      snapshot: p17Snapshot(),
      correlationId: "corr_final_invalid",
    });

    expect(disabled.data.analysis.safeReasonCode).toBe("ai_provider_disabled");
    expect(invalid.data.analysis.safeReasonCode).toBe(
      "ai_provider_config_invalid",
    );
    expect(JSON.stringify({ disabled, invalid })).not.toContain("api_key");
  });
});
