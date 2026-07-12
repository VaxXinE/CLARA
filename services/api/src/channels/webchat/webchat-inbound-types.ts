import type { WorkspaceScope } from "../../workspace/workspace-scope";

export const WEBCHAT_MESSAGE_MAX_LENGTH = 4000;

export type WebchatSafeMetadata = {
  locale?: string;
  referrer?: string;
  campaign?: string;
};

export type WebchatInboundRequest = {
  channelPublicKey: string;
  visitorId: string | null;
  sessionId: string | null;
  customerName: string | null;
  customerEmail: string | null;
  messageText: string;
  pageUrl: string | null;
  userAgent: string | null;
  metadata: WebchatSafeMetadata;
};

export type NormalizedWebchatInboundMessage = WebchatInboundRequest & {
  provider: "webchat";
  receivedAt: Date;
};

export type PersistWebchatInboundInput = {
  scope: WorkspaceScope;
  channelAccountId: string;
  message: NormalizedWebchatInboundMessage;
};

export type PersistWebchatInboundResult = {
  customerId: string;
  conversationId: string;
  messageId: string;
  activityId: string;
  webchatInboundId: string;
};
