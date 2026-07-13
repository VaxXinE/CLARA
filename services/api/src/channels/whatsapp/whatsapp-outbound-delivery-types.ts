import type { WorkspaceScope } from "../../workspace/workspace-scope";

export type WhatsappOutboundDeliveryStatus =
  "pending" | "sent" | "simulated" | "failed" | "skipped";

export type WhatsappOutboundDeliveryMetadata = {
  source?: "whatsapp_reply_send";
  transport?: "simulated";
  recipient_count?: number;
};

export type RecordWhatsappOutboundDeliveryInput = {
  scope: WorkspaceScope;
  channelAccountId: string;
  conversationId: string;
  replyId?: string | null;
  status: WhatsappOutboundDeliveryStatus;
  reasonCode?: string | null;
  providerMessageId?: string | null;
  sentAt?: Date | null;
  metadata?: WhatsappOutboundDeliveryMetadata;
};

export type WhatsappOutboundDeliveryRecord = {
  id: string;
  organizationId: string;
  workspaceId: string;
  channelAccountId: string;
  conversationId: string;
  replyId: string | null;
  provider: "whatsapp";
  status: WhatsappOutboundDeliveryStatus;
  reasonCode: string | null;
  providerMessageId: string | null;
  sentAt: Date | null;
  metadata: WhatsappOutboundDeliveryMetadata;
  createdAt: Date;
  updatedAt: Date;
};
