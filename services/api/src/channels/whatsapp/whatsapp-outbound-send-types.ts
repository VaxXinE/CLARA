import type { WorkspaceScope } from "../../workspace/workspace-scope";

export const WHATSAPP_OUTBOUND_MAX_BODY_LENGTH = 2000;

export type WhatsappOutboundSendCommand = {
  scope: WorkspaceScope;
  channelAccountId: string;
  conversationId: string;
  recipientExternalId: string;
  textBody: string;
  correlationId: string;
};

export type WhatsappOutboundSendResult = {
  status: "sent" | "simulated";
  providerMessageId: string;
  sentAt: Date;
  reasonCode?: string | null;
};
