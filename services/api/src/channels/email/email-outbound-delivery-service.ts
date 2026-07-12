import type { EmailOutboundDeliveryRepository } from "./email-outbound-delivery-repository";
import type {
  EmailOutboundDeliveryRecord,
  GmailOutboundDeliveryStatusDto,
  RecordFailedGmailOutboundSendInput,
  RecordEmailReplyDeliveryInput,
  RecordFailedEmailReplyDeliveryInput,
  RecordGmailOutboundSendResultInput,
} from "./email-outbound-delivery-types";
import { NotFoundError } from "../../errors/app-error";

export class EmailOutboundDeliveryService {
  constructor(private readonly repository: EmailOutboundDeliveryRepository) {}

  async recordReplyResult(
    input: RecordEmailReplyDeliveryInput,
  ): Promise<EmailOutboundDeliveryRecord> {
    return this.repository.recordDelivery({
      scope: input.scope,
      conversationId: input.conversationId,
      customerId: input.customerId ?? null,
      replyId: input.replyId ?? null,
      actorUserId: input.actorUserId,
      provider: input.result.metadata.provider,
      providerMessageId: input.result.providerMessageId,
      providerThreadId: input.result.providerThreadId,
      idempotencyKey: input.idempotencyKey,
      status: input.result.status,
      sentAt: input.result.sentAt,
      metadata:
        input.result.metadata.transport === "simulated"
          ? {
              source: "email_reply_adapter",
              transport: "simulated",
            }
          : {
              source: "email_reply_adapter",
            },
    });
  }

  async recordReplyFailure(
    input: RecordFailedEmailReplyDeliveryInput,
  ): Promise<EmailOutboundDeliveryRecord> {
    return this.repository.recordDelivery({
      scope: input.scope,
      conversationId: input.conversationId,
      customerId: input.customerId ?? null,
      replyId: input.replyId ?? null,
      actorUserId: input.actorUserId,
      provider: input.provider,
      providerMessageId: input.providerMessageId ?? null,
      providerThreadId: input.providerThreadId ?? null,
      idempotencyKey: input.idempotencyKey,
      status: "failed",
      failureCode: input.failureCode,
      failedAt: new Date(),
      metadata: {
        source: "email_reply_adapter",
      },
    });
  }

  async recordGmailOutboundResult(
    input: RecordGmailOutboundSendResultInput,
  ): Promise<EmailOutboundDeliveryRecord> {
    return this.repository.recordDelivery({
      scope: input.scope,
      conversationId: input.conversationId,
      actorUserId: input.actorUserId,
      provider: "gmail",
      providerMessageId: input.providerMessageId,
      providerThreadId: null,
      idempotencyKey: input.idempotencyKey,
      status: input.status,
      sentAt: input.sentAt,
      metadata: {
        source: "gmail_outbound_send",
        transport: input.status === "simulated" ? "simulated" : "gmail",
      },
    });
  }

  async recordGmailOutboundFailure(
    input: RecordFailedGmailOutboundSendInput,
  ): Promise<EmailOutboundDeliveryRecord> {
    return this.repository.recordDelivery({
      scope: input.scope,
      conversationId: input.conversationId,
      actorUserId: input.actorUserId,
      provider: "gmail",
      providerMessageId: null,
      providerThreadId: null,
      idempotencyKey: input.idempotencyKey,
      status: "failed",
      failureCode: input.failureCode,
      failedAt: new Date(),
      metadata: {
        source: "gmail_outbound_send",
      },
    });
  }

  async getGmailOutboundStatus(input: {
    scope: RecordGmailOutboundSendResultInput["scope"];
    deliveryId: string;
    correlationId?: string;
  }): Promise<GmailOutboundDeliveryStatusDto> {
    const record = await this.repository.findByIdScoped(
      input.scope,
      input.deliveryId,
    );

    if (!record || record.provider !== "gmail") {
      throw new NotFoundError("Gmail outbound delivery not found.");
    }

    return {
      outbound_delivery_id: record.id,
      provider: "gmail",
      status: record.status,
      ...(record.failureCode ? { reason_code: record.failureCode } : {}),
      ...(record.providerMessageId
        ? { provider_message_id: record.providerMessageId }
        : {}),
      conversation_id: record.conversationId,
      ...(record.sentAt ? { sent_at: record.sentAt.toISOString() } : {}),
      ...(record.failedAt ? { failed_at: record.failedAt.toISOString() } : {}),
      created_at: record.createdAt.toISOString(),
      ...(input.correlationId ? { correlation_id: input.correlationId } : {}),
    };
  }
}
