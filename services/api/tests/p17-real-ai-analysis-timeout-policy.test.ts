import { describe, expect, it } from "vitest";
import { ExtensionSnapshotAiAnalysisService } from "../src/ai/extension-snapshot-ai-analysis-service";
import { FixtureExtensionSnapshotAiAnalysisRepository } from "../src/ai/extension-snapshot-ai-analysis-repository";
import type { ExtensionSnapshotAiAnalysisProvider } from "../src/ai/extension-snapshot-ai-analysis-provider";
import {
  p17AiConfig,
  p17Auth,
  p17Scope,
} from "./p17-real-ai-analysis-service.test";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 real AI analysis timeout policy", () => {
  it("returns a safe timeout reason", async () => {
    const slowProvider: ExtensionSnapshotAiAnalysisProvider = {
      analyze: () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                provider: "mock",
                model: "mock-model",
                output: {
                  summary: "late",
                  customerIntent: null,
                  sentiment: "unknown",
                  urgency: "unknown",
                  suggestedNextAction: null,
                  riskFlags: [],
                  confidence: 0,
                  evidenceReferences: [],
                },
              }),
            20,
          );
        }),
    };
    const service = new ExtensionSnapshotAiAnalysisService(
      p17AiConfig({ requestTimeoutMs: 1 }),
      slowProvider,
      new FixtureExtensionSnapshotAiAnalysisRepository(),
    );

    const result = await service.analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_timeout",
      snapshot: p17Snapshot(),
      correlationId: "corr_timeout",
    });

    expect(result.data.analysis.safeReasonCode).toBe("ai_request_timeout");
    expect(JSON.stringify(result)).not.toContain("provider raw");
  });
});
