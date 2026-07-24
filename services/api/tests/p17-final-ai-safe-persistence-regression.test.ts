import { describe, expect, it } from "vitest";
import { FixtureExtensionSnapshotAiAnalysisRepository } from "../src/ai/extension-snapshot-ai-analysis-repository";
import { ExtensionSnapshotAiAnalysisService } from "../src/ai/extension-snapshot-ai-analysis-service";
import { MockAiAnalysisProvider } from "../src/ai/mock-ai-analysis-provider";
import {
  p17AiConfig,
  p17Auth,
  p17Scope,
} from "./p17-real-ai-analysis-service.test";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 final AI safe persistence regression", () => {
  it("stores safe result fields only", async () => {
    const repository = new FixtureExtensionSnapshotAiAnalysisRepository();
    const service = new ExtensionSnapshotAiAnalysisService(
      p17AiConfig(),
      new MockAiAnalysisProvider(),
      repository,
    );

    await service.analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_final_persist",
      snapshot: p17Snapshot(),
      correlationId: "corr_final_persist",
    });

    const persisted = JSON.stringify(repository.listForTest());
    expect(persisted).toContain("safeReasonCode");
    expect(persisted).not.toMatch(
      /rawPrompt|rawProviderPayload|rawProviderResponse/,
    );
    expect(persisted).not.toContain("access_token");
  });
});
