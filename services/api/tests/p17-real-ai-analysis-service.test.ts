import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { ExtensionSnapshotAiAnalysisService } from "../src/ai/extension-snapshot-ai-analysis-service";
import { FixtureExtensionSnapshotAiAnalysisRepository } from "../src/ai/extension-snapshot-ai-analysis-repository";
import { MockAiAnalysisProvider } from "../src/ai/mock-ai-analysis-provider";
import type { AiProviderRuntimeConfig } from "../src/ai/ai-provider-runtime-config";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

export const p17Auth = buildAuthContext({
  userId: "usr_owner",
  organizationId: "org_1",
  workspaceId: "wks_1",
  role: "owner",
});

export const p17Scope = { organizationId: "org_1", workspaceId: "wks_1" };

export function p17AiConfig(
  patch: Partial<AiProviderRuntimeConfig> = {},
): AiProviderRuntimeConfig {
  return {
    mode: "mock",
    provider: "mock",
    hasApiKey: false,
    modelAllowlist: ["mock-model"],
    defaultModel: "mock-model",
    requestTimeoutMs: 1000,
    maxInputChars: 12_000,
    maxOutputTokens: 1200,
    dailyCostBudgetCents: 100,
    workspaceDailyBudgetCents: 100,
    operatorDailyBudgetCents: 100,
    ...patch,
  };
}

export function p17AnalysisService(
  patch: Partial<AiProviderRuntimeConfig> = {},
) {
  return new ExtensionSnapshotAiAnalysisService(
    p17AiConfig(patch),
    new MockAiAnalysisProvider(),
    new FixtureExtensionSnapshotAiAnalysisRepository(),
  );
}

describe("P17 real AI analysis service", () => {
  it("executes controlled backend analysis with a deterministic mock provider", async () => {
    const result = await p17AnalysisService().analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_1",
      snapshot: p17Snapshot(),
      correlationId: "corr_1",
    });

    expect(result.data.analysis).toMatchObject({
      status: "generated",
      safeReasonCode: "ok",
      provider: "mock",
      model: "mock-model",
      requiresHumanReview: true,
      outboundAutoSendEnabled: false,
    });
    expect(JSON.stringify(result)).not.toContain("rawProviderPayload");
    expect(JSON.stringify(result)).not.toContain("access_token");
  });
});
