import { sanitizeAiPlainText } from "./ai-context-sanitizer";
import { redactExtensionSnapshotPii } from "./extension-snapshot-pii-redaction";
import type { ExtensionSnapshotAiAnalysisOutput } from "./extension-snapshot-ai-analysis-types";

const sentiments = new Set(["positive", "neutral", "negative", "unknown"]);
const urgencies = new Set(["low", "medium", "high", "unknown"]);

function safeText(value: unknown, maxChars: number): string | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  return redactExtensionSnapshotPii(sanitizeAiPlainText(value, maxChars));
}

function safeStringArray(value: unknown, maxItems: number): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .slice(0, maxItems)
    .map((item) => safeText(item, 160))
    .filter((item): item is string => Boolean(item));
}

export function sanitizeExtensionSnapshotAiAnalysisOutput(
  value: unknown,
): ExtensionSnapshotAiAnalysisOutput {
  const input =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const confidence =
    typeof input.confidence === "number" && Number.isFinite(input.confidence)
      ? Math.min(1, Math.max(0, input.confidence))
      : 0;
  const sentiment =
    typeof input.sentiment === "string" && sentiments.has(input.sentiment)
      ? (input.sentiment as ExtensionSnapshotAiAnalysisOutput["sentiment"])
      : "unknown";
  const urgency =
    typeof input.urgency === "string" && urgencies.has(input.urgency)
      ? (input.urgency as ExtensionSnapshotAiAnalysisOutput["urgency"])
      : "unknown";

  return {
    summary: safeText(input.summary, 500),
    customerIntent: safeText(input.customerIntent, 120),
    sentiment,
    urgency,
    suggestedNextAction: safeText(input.suggestedNextAction, 240),
    riskFlags: safeStringArray(input.riskFlags, 8),
    confidence,
    evidenceReferences: safeStringArray(input.evidenceReferences, 12),
  };
}
