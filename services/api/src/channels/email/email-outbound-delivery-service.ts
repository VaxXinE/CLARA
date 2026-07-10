import type { EmailOutboundDeliveryRepository } from "./email-outbound-delivery-repository";
import type {
  EmailOutboundDeliveryRecord,
  RecordEmailReplyDeliveryInput,
  RecordFailedEmailReplyDeliveryInput,
} from "./email-outbound-delivery-types";

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
}
