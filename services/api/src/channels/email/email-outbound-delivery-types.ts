import type { EmailReplyResult } from "./email-reply-types";

export type EmailOutboundDeliveryStatus = "simulated" | "sent" | "failed";

export type EmailOutboundDeliveryMetadata = {
  source?: "email_reply_adapter" | "gmail_outbound_send";
  transport?: "simulated" | "gmail";
};

export type RecordEmailOutboundDeliveryScope = {
  organizationId: string;
  workspaceId: string;
};

export type RecordSuccessfulEmailOutboundDeliveryInput = {
  scope: RecordEmailOutboundDeliveryScope;
  conversationId: string;
  customerId?: string | null | undefined;
  replyId?: string | null | undefined;
  actorUserId: string;
  provider: string;
  providerMessageId: string;
  providerThreadId?: string | null | undefined;
  idempotencyKey?: string | null | undefined;
  status: "simulated" | "sent";
  sentAt: Date;
  metadata?: EmailOutboundDeliveryMetadata;
};

export type RecordFailedEmailOutboundDeliveryInput = {
  scope: RecordEmailOutboundDeliveryScope;
  conversationId: string;
  customerId?: string | null | undefined;
  replyId?: string | null | undefined;
  actorUserId: string;
  provider: string;
  providerMessageId?: string | null | undefined;
  providerThreadId?: string | null | undefined;
  idempotencyKey?: string | null | undefined;
  status: "failed";
  failureCode: string;
  failedAt: Date;
  metadata?: EmailOutboundDeliveryMetadata;
};

export type RecordEmailOutboundDeliveryInput =
  | RecordSuccessfulEmailOutboundDeliveryInput
  | RecordFailedEmailOutboundDeliveryInput;

export type EmailOutboundDeliveryRecord = {
  id: string;
  organizationId: string;
  workspaceId: string;
  conversationId: string;
  customerId: string | null;
  replyId: string | null;
  actorUserId: string;
  channel: "email";
  provider: string;
  providerMessageId: string | null;
  providerThreadId: string | null;
  idempotencyKey: string | null;
  status: EmailOutboundDeliveryStatus;
  failureCode: string | null;
  metadata: EmailOutboundDeliveryMetadata;
  sentAt: Date | null;
  failedAt: Date | null;
  createdAt: Date;
  alreadyRecorded: boolean;
};

export type GmailOutboundDeliveryStatusDto = {
  outbound_delivery_id: string;
  provider: "gmail";
  status: EmailOutboundDeliveryStatus;
  reason_code?: string;
  provider_message_id?: string;
  conversation_id: string;
  sent_at?: string;
  failed_at?: string;
  created_at: string;
  correlation_id?: string;
};

export type RecordEmailReplyDeliveryInput = {
  scope: RecordEmailOutboundDeliveryScope;
  conversationId: string;
  customerId?: string | null | undefined;
  replyId?: string | null | undefined;
  actorUserId: string;
  idempotencyKey?: string | null | undefined;
  result: EmailReplyResult;
};

export type RecordFailedEmailReplyDeliveryInput = {
  scope: RecordEmailOutboundDeliveryScope;
  conversationId: string;
  customerId?: string | null | undefined;
  replyId?: string | null | undefined;
  actorUserId: string;
  provider: string;
  providerMessageId?: string | null | undefined;
  providerThreadId?: string | null | undefined;
  idempotencyKey?: string | null | undefined;
  failureCode: string;
};

export type RecordGmailOutboundSendResultInput = {
  scope: RecordEmailOutboundDeliveryScope;
  conversationId: string;
  actorUserId: string;
  providerMessageId: string;
  idempotencyKey?: string | null | undefined;
  status: "simulated" | "sent";
  sentAt: Date;
};

export type RecordFailedGmailOutboundSendInput = {
  scope: RecordEmailOutboundDeliveryScope;
  conversationId: string;
  actorUserId: string;
  idempotencyKey?: string | null | undefined;
  failureCode: string;
};
