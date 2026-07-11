import type { Role } from "../../auth/permissions";

export const GMAIL_OUTBOUND_MAX_BODY_LENGTH = 2_000;
export const GMAIL_OUTBOUND_MAX_RECIPIENTS = 10;
export const GMAIL_OUTBOUND_MAX_SUBJECT_LENGTH = 200;
export const GMAIL_OUTBOUND_DEFAULT_SUBJECT = "(no subject)";

export type GmailOutboundTrustedActor = {
  userId: string;
  organizationId: string;
  workspaceId: string;
  role: Role;
};

export type GmailOutboundSendMessageInput = {
  providerAccountId: string;
  conversationId?: string | null;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string | null;
  textBody: string;
  idempotencyKey?: string | null;
  correlationId?: string | null;
};

export type GmailOutboundSendServiceInput = {
  actor: GmailOutboundTrustedActor;
  message: GmailOutboundSendMessageInput;
};

export type GmailOutboundSendReasonCode =
  "provider_send_failed" | "simulated_send_completed";

export type GmailOutboundSendResultDto = {
  status: "queued" | "sent" | "skipped" | "failed" | "simulated";
  provider: "gmail";
  provider_message_id?: string;
  outbound_delivery_id?: string;
  reason_code?: GmailOutboundSendReasonCode;
  sent_at?: string;
  correlation_id?: string;
};
