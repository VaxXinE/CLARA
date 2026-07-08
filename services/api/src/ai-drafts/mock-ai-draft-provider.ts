import {
  AI_DRAFT_PROMPT_VERSION,
  type AiDraftProvider,
  type GenerateAiDraftInput,
  type GenerateAiDraftResult,
} from "./ai-draft-provider";

function firstName(displayName: string): string {
  return displayName.trim().split(/\s+/)[0] ?? "there";
}

function toneLead(tone?: string): string {
  switch ((tone ?? "").trim().toLowerCase()) {
    case "friendly":
      return "Hi";
    case "empathetic":
      return "Hello";
    case "professional":
      return "Hello";
    default:
      return "Hi";
  }
}

function buildClosing(instruction?: string): string {
  if (!instruction) {
    return "Could you confirm the details so we can help you with the next step?";
  }

  return `Could you confirm the details so we can help you with the next step? (${instruction.trim()})`;
}

export class MockAiDraftProvider implements AiDraftProvider {
  async generateDraft(
    input: GenerateAiDraftInput,
  ): Promise<GenerateAiDraftResult> {
    const greeting = toneLead(input.tone);
    const customerFirstName = firstName(input.customerName);
    const latestCustomerMessage = [...input.recentMessages]
      .reverse()
      .find((message) => message.senderType === "customer");

    const messageReference = latestCustomerMessage
      ? "your recent message"
      : "your question";

    return {
      provider: "mock",
      model: "mock-clara-draft-v1",
      promptVersion: AI_DRAFT_PROMPT_VERSION,
      latencyMs: 25,
      draftBody: `${greeting} ${customerFirstName}, thanks for reaching out. We reviewed ${messageReference} and can help from our ${input.customerSource} workspace flow. ${buildClosing(input.instruction)}`,
    };
  }
}
