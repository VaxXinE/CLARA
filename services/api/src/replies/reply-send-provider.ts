export const REPLY_MAX_BODY_LENGTH = 2_000;

export type SendReplyProviderInput = {
  conversationId: string;
  source: string;
  body: string;
};

export type SendReplyProviderResult = {
  provider: string;
  status: "sent";
  deliveryStatus: "sent" | "simulated";
};

export interface ReplySendProvider {
  sendReply(input: SendReplyProviderInput): Promise<SendReplyProviderResult>;
}

export function normalizeReplyBody(body: string): string {
  return body.replace(/\r\n/g, "\n").trim();
}

export function validateReplyBody(body: string): string {
  const normalized = normalizeReplyBody(body);

  if (normalized.length === 0) {
    throw new Error("Reply body is empty.");
  }

  if (normalized.length > REPLY_MAX_BODY_LENGTH) {
    throw new Error("Reply body is too long.");
  }

  return normalized;
}
