export type WebchatChannelAdapter = {
  normalizeInboundMessage(input: {
    channelPublicKey: string;
    visitorId?: string | null;
    sessionId?: string | null;
    customerName?: string | null;
    customerEmail?: string | null;
    messageText: string;
    pageUrl?: string | null;
    userAgent?: string | null;
    metadata?: unknown;
  }): Promise<
    import("./webchat-inbound-types").NormalizedWebchatInboundMessage
  >;
};
