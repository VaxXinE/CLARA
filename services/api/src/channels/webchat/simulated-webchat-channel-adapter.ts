import type { WebchatChannelAdapter } from "./webchat-channel-types";
import type {
  NormalizedWebchatInboundMessage,
  WebchatSafeMetadata,
} from "./webchat-inbound-types";

function stripUnsafeText(value: string): string {
  return value.trim().replace(/[<>]/g, "");
}

function optionalText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? stripUnsafeText(trimmed) : null;
}

function safeMetadata(value: unknown): WebchatSafeMetadata {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const input = value as Record<string, unknown>;
  const metadata: WebchatSafeMetadata = {};

  for (const key of ["locale", "referrer", "campaign"] as const) {
    if (typeof input[key] === "string") {
      metadata[key] = stripUnsafeText(input[key].slice(0, 200));
    }
  }

  return metadata;
}

export class SimulatedWebchatChannelAdapter implements WebchatChannelAdapter {
  async normalizeInboundMessage(input: {
    channelPublicKey: string;
    visitorId?: string | null;
    sessionId?: string | null;
    customerName?: string | null;
    customerEmail?: string | null;
    messageText: string;
    pageUrl?: string | null;
    userAgent?: string | null;
    metadata?: unknown;
  }): Promise<NormalizedWebchatInboundMessage> {
    return {
      provider: "webchat",
      channelPublicKey: stripUnsafeText(input.channelPublicKey),
      visitorId: optionalText(input.visitorId),
      sessionId: optionalText(input.sessionId),
      customerName: optionalText(input.customerName),
      customerEmail: input.customerEmail?.trim().toLowerCase() ?? null,
      messageText: stripUnsafeText(input.messageText),
      pageUrl: input.pageUrl?.trim() ?? null,
      userAgent: optionalText(input.userAgent),
      metadata: safeMetadata(input.metadata),
      receivedAt: new Date(),
    };
  }
}
