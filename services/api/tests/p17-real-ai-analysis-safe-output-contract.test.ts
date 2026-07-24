import { describe, expect, it } from "vitest";
import { sanitizeExtensionSnapshotAiAnalysisOutput } from "../src/ai/extension-snapshot-ai-analysis-safe-output";

describe("P17 real AI analysis safe output contract", () => {
  it("keeps only deterministic safe output fields", () => {
    const output = sanitizeExtensionSnapshotAiAnalysisOutput({
      summary: "Call customer@example.test with card 4111111111111111",
      customerIntent: "buy",
      sentiment: "positive",
      urgency: "high",
      suggestedNextAction: "Human review",
      riskFlags: ["needs_review"],
      confidence: 2,
      evidenceReferences: ["m1"],
      rawProviderPayload: "hidden",
    });

    expect(output).toEqual({
      summary: "Call [redacted] with card [redacted]",
      customerIntent: "buy",
      sentiment: "positive",
      urgency: "high",
      suggestedNextAction: "Human review",
      riskFlags: ["needs_review"],
      confidence: 1,
      evidenceReferences: ["m1"],
    });
    expect(JSON.stringify(output)).not.toContain("rawProviderPayload");
  });
});
