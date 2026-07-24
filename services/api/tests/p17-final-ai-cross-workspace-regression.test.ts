import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureExtensionSnapshotAiAnalysisRepository } from "../src/ai/extension-snapshot-ai-analysis-repository";
import { ExtensionSnapshotAiAnalysisService } from "../src/ai/extension-snapshot-ai-analysis-service";
import { MockAiAnalysisProvider } from "../src/ai/mock-ai-analysis-provider";
import {
  p17AiConfig,
  p17Auth,
  p17Scope,
} from "./p17-real-ai-analysis-service.test";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 final AI cross-workspace regression", () => {
  it("does not read analysis across workspace scope", async () => {
    const service = new ExtensionSnapshotAiAnalysisService(
      p17AiConfig(),
      new MockAiAnalysisProvider(),
      new FixtureExtensionSnapshotAiAnalysisRepository(),
    );

    await service.analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_final_cross",
      snapshot: p17Snapshot(),
      correlationId: "corr_final_cross",
    });

    await expect(
      service.getLatest({
        auth: buildAuthContext({
          ...p17Auth,
          workspaceId: "wks_other",
        }),
        snapshotId: "snap_final_cross",
      }),
    ).rejects.toThrow("Resource not found.");
  });
});
