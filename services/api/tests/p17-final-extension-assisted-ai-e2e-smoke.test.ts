import { describe, expect, it } from "vitest";
import { buildExtensionSnapshotAiContext } from "../src/ai/extension-snapshot-ai-context-builder";
import { FixtureExtensionSnapshotAiAnalysisRepository } from "../src/ai/extension-snapshot-ai-analysis-repository";
import { ExtensionSnapshotAiAnalysisService } from "../src/ai/extension-snapshot-ai-analysis-service";
import { MockAiAnalysisProvider } from "../src/ai/mock-ai-analysis-provider";
import {
  p17AiConfig,
  p17Auth,
  p17Scope,
} from "./p17-real-ai-analysis-service.test";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 final extension-assisted AI e2e smoke", () => {
  it("runs sanitized snapshot to AI-ready context to safe persisted review output", async () => {
    const snapshot = p17Snapshot();
    const context = buildExtensionSnapshotAiContext({
      authContext: p17Auth,
      scope: p17Scope,
      snapshot,
    });
    const repository = new FixtureExtensionSnapshotAiAnalysisRepository();
    const service = new ExtensionSnapshotAiAnalysisService(
      p17AiConfig(),
      new MockAiAnalysisProvider(),
      repository,
    );

    const response = await service.analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_final_e2e",
      snapshot,
      correlationId: "corr_final_e2e",
    });
    const persisted = JSON.stringify(repository.listForTest());

    expect(context.messages[0]?.untrustedText).toContain(
      "<untrusted_customer_text>",
    );
    expect(response.data.analysis).toMatchObject({
      status: "generated",
      safeReasonCode: "ok",
      requiresHumanReview: true,
      outboundAutoSendEnabled: false,
    });
    expect(persisted).toContain("Customer conversation needs human review.");
    expect(persisted).not.toContain("rawProviderPayload");
    expect(persisted).not.toContain("Need help with order.");
  });
});
