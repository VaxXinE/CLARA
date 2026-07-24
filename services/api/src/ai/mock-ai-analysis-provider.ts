import type { ExtensionSnapshotAiAnalysisProvider } from "./extension-snapshot-ai-analysis-provider";
import type {
  ExtensionSnapshotAiAnalysisProviderInput,
  ExtensionSnapshotAiAnalysisProviderResult,
} from "./extension-snapshot-ai-analysis-types";

export class MockAiAnalysisProvider implements ExtensionSnapshotAiAnalysisProvider {
  async analyze(
    input: ExtensionSnapshotAiAnalysisProviderInput,
  ): Promise<ExtensionSnapshotAiAnalysisProviderResult> {
    const incoming = input.context.messages.find(
      (message) => message.direction === "incoming",
    );

    return {
      provider: "mock",
      model: input.model,
      output: {
        summary: "Customer conversation needs human review.",
        customerIntent: incoming ? "request_support" : "unknown",
        sentiment: "neutral",
        urgency: "medium",
        suggestedNextAction:
          "Review the conversation and decide the next step.",
        riskFlags: input.context.messages.some(
          (message) => message.promptInjectionIntent,
        )
          ? ["prompt_injection_attempt"]
          : [],
        confidence: 0.8,
        evidenceReferences: input.context.messages
          .slice(0, 3)
          .map((message) => message.id),
      },
    };
  }
}
