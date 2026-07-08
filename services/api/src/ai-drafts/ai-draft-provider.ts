export const AI_DRAFT_PROMPT_VERSION = "mvp_reply_draft_v1";
export const AI_DRAFT_MAX_BODY_LENGTH = 2_000;

export type AiDraftContextMessage = {
  direction: string;
  senderType: string;
  body: string;
};

export type GenerateAiDraftInput = {
  conversationId: string;
  conversationStatus: string;
  customerName: string;
  customerSource: string;
  customerStatus: string;
  recentMessages: AiDraftContextMessage[];
  tone?: string;
  instruction?: string;
};

export type GenerateAiDraftResult = {
  provider: string;
  model: string;
  promptVersion: string;
  latencyMs: number;
  draftBody: string;
};

export interface AiDraftProvider {
  generateDraft(input: GenerateAiDraftInput): Promise<GenerateAiDraftResult>;
}

export function normalizeDraftBody(body: string): string {
  return body.replace(/\r\n/g, "\n").trim();
}

export function validateDraftBody(body: string): string {
  const normalized = normalizeDraftBody(body);

  if (normalized.length === 0) {
    throw new Error("AI draft provider returned an empty draft.");
  }

  if (normalized.length > AI_DRAFT_MAX_BODY_LENGTH) {
    throw new Error("AI draft provider returned an oversized draft.");
  }

  return normalized;
}
