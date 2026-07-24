import { describe, expect, it } from "vitest";
import { sanitizeExtensionSnapshotAiAnalysisOutput } from "../src/ai/extension-snapshot-ai-analysis-safe-output";

describe("P17 final AI PII redaction regression", () => {
  it("redacts PII-like provider output before persistence or display", () => {
    const output = sanitizeExtensionSnapshotAiAnalysisOutput({
      summary: "Customer email customer@example.test and phone +6281234567890",
      customerIntent: "Needs account help",
      sentiment: "neutral",
      urgency: "medium",
      suggestedNextAction: "Reply without exposing customer@example.test",
      riskFlags: ["contains customer@example.test"],
      confidence: 0.8,
      evidenceReferences: ["message customer@example.test"],
    });
    const text = JSON.stringify(output);

    expect(text).not.toContain("customer@example.test");
    expect(text).not.toContain("+6281234567890");
  });
});
