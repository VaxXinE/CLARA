import type { WorkspaceScope } from "../../workspace/workspace-scope";

export const WHATSAPP_MESSAGE_MAX_LENGTH = 4000;

export type WhatsappSafeMetadata = {
  phone_number_id?: string;
  display_phone_number?: string;
};

export type NormalizedWhatsappInboundMessage = {
  provider: "whatsapp";
  channelType: "messaging";
  externalMessageId: string;
  externalConversationId: string | null;
  senderExternalId: string;
  senderDisplayName: string | null;
  messageText: string;
  receivedAt: Date;
  metadata: WhatsappSafeMetadata;
};

export type PersistWhatsappInboundInput = {
  scope: WorkspaceScope;
  channelAccountId: string;
  message: NormalizedWhatsappInboundMessage;
};

export type PersistWhatsappInboundResult = {
  customerId: string;
  conversationId: string;
  messageId: string;
  activityId: string;
  whatsappInboundId: string;
  duplicate: boolean;
};
