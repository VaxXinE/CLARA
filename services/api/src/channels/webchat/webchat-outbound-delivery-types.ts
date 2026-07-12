import type { WorkspaceScope } from "../../workspace/workspace-scope";

export type WebchatOutboundDeliveryStatus =
  "pending" | "sent" | "simulated" | "failed" | "skipped";

export type WebchatOutboundDeliveryMetadata = {
  source?: "webchat_reply_send";
  transport?: "simulated";
};

export type RecordWebchatOutboundDeliveryInput = {
  scope: WorkspaceScope;
  channelAccountId: string;
  conversationId: string;
  replyId?: string | null;
  status: WebchatOutboundDeliveryStatus;
  reasonCode?: string | null;
  providerMessageId?: string | null;
  sentAt?: Date | null;
  metadata?: WebchatOutboundDeliveryMetadata;
};

export type WebchatOutboundDeliveryRecord = {
  id: string;
  organizationId: string;
  workspaceId: string;
  channelAccountId: string;
  conversationId: string;
  replyId: string | null;
  provider: "webchat";
  status: WebchatOutboundDeliveryStatus;
  reasonCode: string | null;
  providerMessageId: string | null;
  sentAt: Date | null;
  metadata: WebchatOutboundDeliveryMetadata;
  createdAt: Date;
  updatedAt: Date;
};

export type WebchatOutboundDeliveryStatusDto = {
  outbound_delivery_id: string;
  provider: "webchat";
  status: WebchatOutboundDeliveryStatus;
  reason_code?: string;
  provider_message_id?: string;
  conversation_id: string;
  channel_account_id: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
  correlation_id?: string;
};
