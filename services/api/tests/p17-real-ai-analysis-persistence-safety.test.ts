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

describe("P17 real AI analysis persistence safety", () => {
  it("persists safe analysis output without raw prompt or provider payload", async () => {
    const repository = new FixtureExtensionSnapshotAiAnalysisRepository();
    const service = new ExtensionSnapshotAiAnalysisService(
      p17AiConfig(),
      new MockAiAnalysisProvider(),
      repository,
    );

    await service.analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_persist",
      snapshot: p17Snapshot(),
      correlationId: "corr_persist",
    });

    const persisted = JSON.stringify(repository.listForTest());
    expect(persisted).toContain("Customer conversation needs human review.");
    expect(persisted).not.toContain("rawPrompt");
    expect(persisted).not.toContain("rawProviderPayload");
    expect(persisted).not.toContain("Need help with order.");
  });
});
