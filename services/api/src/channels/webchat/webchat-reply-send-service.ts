import type { Role } from "../../auth/permissions";
import { assertPermission } from "../../auth/permissions";
import type { ChannelAccountRepository } from "../channel-account-repository";
import {
  AppError,
  NotFoundError,
  ValidationError,
} from "../../errors/app-error";
import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type { WebchatReplyAdapter } from "./webchat-reply-adapter";
import type { WebchatOutboundDeliveryRepository } from "./webchat-outbound-delivery-repository";
import type {
  WebchatOutboundDeliveryMetadata,
  WebchatOutboundDeliveryRecord,
  WebchatOutboundDeliveryStatusDto,
} from "./webchat-outbound-delivery-types";

export type WebchatReplySendInput = {
  actor: {
    userId: string;
    role: Role;
  };
  scope: WorkspaceScope;
  conversationId: string;
  conversationSource: string;
  replyId?: string | null;
  body: string;
  correlationId: string;
};

function isWebchatSource(source: string): boolean {
  const normalized = source.trim().toLowerCase();

  return normalized === "webchat" || normalized === "web_chat_demo";
}

function toStatusDto(
  record: WebchatOutboundDeliveryRecord,
  correlationId?: string,
): WebchatOutboundDeliveryStatusDto {
  return {
    outbound_delivery_id: record.id,
    provider: "webchat",
    status: record.status,
    ...(record.reasonCode ? { reason_code: record.reasonCode } : {}),
    ...(record.providerMessageId
      ? { provider_message_id: record.providerMessageId }
      : {}),
    conversation_id: record.conversationId,
    channel_account_id: record.channelAccountId,
    ...(record.sentAt ? { sent_at: record.sentAt.toISOString() } : {}),
    created_at: record.createdAt.toISOString(),
    updated_at: record.updatedAt.toISOString(),
    ...(correlationId ? { correlation_id: correlationId } : {}),
  };
}

export class WebchatReplySendService {
  constructor(
    private readonly channelAccounts: Pick<
      ChannelAccountRepository,
      "listScoped"
    >,
    private readonly deliveries: WebchatOutboundDeliveryRepository,
    private readonly adapter: WebchatReplyAdapter,
  ) {}

  async send(
    input: WebchatReplySendInput,
  ): Promise<WebchatOutboundDeliveryRecord> {
    assertPermission(input.actor.role, "reply:send");

    if (!isWebchatSource(input.conversationSource)) {
      throw new ValidationError("Conversation is not a Webchat conversation.");
    }

    const channelAccountId =
      (await this.deliveries.findChannelAccountIdForConversation(
        input.scope,
        input.conversationId,
      )) ?? (await this.findDefaultWebchatChannelAccountId(input.scope));

    try {
      const result = await this.adapter.sendReply({
        scope: input.scope,
        channelAccountId,
        conversationId: input.conversationId,
        body: input.body,
        correlationId: input.correlationId,
      });
      const metadata: WebchatOutboundDeliveryMetadata = {
        source: "webchat_reply_send",
      };

      if (result.status === "simulated") {
        metadata.transport = "simulated";
      }

      return this.deliveries.recordDelivery({
        scope: input.scope,
        channelAccountId,
        conversationId: input.conversationId,
        ...(input.replyId ? { replyId: input.replyId } : {}),
        status: result.status,
        reasonCode: result.reasonCode,
        providerMessageId: result.providerMessageId,
        sentAt: result.sentAt,
        metadata,
      });
    } catch (error) {
      if (error instanceof AppError && error.statusCode < 500) {
        throw error;
      }

      return this.deliveries.recordDelivery({
        scope: input.scope,
        channelAccountId,
        conversationId: input.conversationId,
        ...(input.replyId ? { replyId: input.replyId } : {}),
        status: "failed",
        reasonCode: "provider_send_failed",
        providerMessageId: null,
        sentAt: null,
        metadata: {
          source: "webchat_reply_send",
        },
      });
    }
  }

  async getStatus(input: {
    scope: WorkspaceScope;
    deliveryId: string;
    correlationId?: string;
  }): Promise<WebchatOutboundDeliveryStatusDto> {
    const record = await this.deliveries.findByIdScoped(
      input.scope,
      input.deliveryId,
    );

    if (!record) {
      throw new NotFoundError("Webchat outbound delivery not found.");
    }

    return toStatusDto(record, input.correlationId);
  }

  async getLatestConversationStatus(input: {
    scope: WorkspaceScope;
    conversationId: string;
    correlationId?: string;
  }): Promise<WebchatOutboundDeliveryStatusDto | null> {
    const record = await this.deliveries.findLatestByConversationScoped(
      input.scope,
      input.conversationId,
    );

    return record ? toStatusDto(record, input.correlationId) : null;
  }

  private async findDefaultWebchatChannelAccountId(
    scope: WorkspaceScope,
  ): Promise<string> {
    const account = (await this.channelAccounts.listScoped(scope)).find(
      (item) => item.provider === "webchat" && item.status === "connected",
    );

    if (!account) {
      throw new NotFoundError("Webchat channel account not found.");
    }

    return account.id;
  }
}
