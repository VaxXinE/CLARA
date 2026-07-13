import type { Role } from "../../auth/permissions";
import { assertPermission } from "../../auth/permissions";
import type { ChannelAccountRepository } from "../channel-account-repository";
import {
  AppError,
  NotFoundError,
  ValidationError,
} from "../../errors/app-error";
import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type { WhatsappOutboundSendClient } from "./whatsapp-outbound-send-client";
import { WHATSAPP_OUTBOUND_MAX_BODY_LENGTH } from "./whatsapp-outbound-send-types";
import type { WhatsappOutboundDeliveryRepository } from "./whatsapp-outbound-delivery-repository";
import type {
  RecordWhatsappOutboundDeliveryInput,
  WhatsappOutboundDeliveryRecord,
} from "./whatsapp-outbound-delivery-types";

export type WhatsappReplySendInput = {
  actor: {
    userId: string;
    role: Role;
  };
  scope: WorkspaceScope;
  conversationId: string;
  conversationSource: string;
  recipientExternalId: string;
  replyId?: string | null;
  body: string;
  correlationId: string;
};

export function isWhatsappSource(source: string): boolean {
  const normalized = source.trim().toLowerCase();

  return normalized === "whatsapp";
}

function normalizeBody(value: string): string {
  const body = value.replace(/\r\n/g, "\n").trim();

  if (body.length === 0) {
    throw new ValidationError("WhatsApp reply body cannot be empty.");
  }

  if (body.length > WHATSAPP_OUTBOUND_MAX_BODY_LENGTH) {
    throw new ValidationError(
      "WhatsApp reply body exceeds the maximum length.",
    );
  }

  return body;
}

function normalizeRecipient(value: string): string {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new ValidationError("WhatsApp recipient is required.");
  }

  return trimmed;
}

export class WhatsappReplySendService {
  constructor(
    private readonly channelAccounts: Pick<
      ChannelAccountRepository,
      "listScoped"
    >,
    private readonly deliveries: WhatsappOutboundDeliveryRepository,
    private readonly client: WhatsappOutboundSendClient,
  ) {}

  async send(
    input: WhatsappReplySendInput,
  ): Promise<WhatsappOutboundDeliveryRecord> {
    assertPermission(input.actor.role, "reply:send");

    if (!isWhatsappSource(input.conversationSource)) {
      throw new ValidationError("Conversation is not a WhatsApp conversation.");
    }

    const channelAccountId =
      (await this.deliveries.findChannelAccountIdForConversation(
        input.scope,
        input.conversationId,
      )) ?? (await this.findDefaultWhatsappChannelAccountId(input.scope));

    try {
      const result = await this.client.send({
        scope: input.scope,
        channelAccountId,
        conversationId: input.conversationId,
        recipientExternalId: normalizeRecipient(input.recipientExternalId),
        textBody: normalizeBody(input.body),
        correlationId: input.correlationId,
      });

      const deliveryInput: RecordWhatsappOutboundDeliveryInput = {
        scope: input.scope,
        channelAccountId,
        conversationId: input.conversationId,
        status: result.status,
        providerMessageId: result.providerMessageId,
        sentAt: result.sentAt,
        metadata: {
          source: "whatsapp_reply_send",
          ...(result.status === "simulated" ? { transport: "simulated" } : {}),
          recipient_count: 1,
        },
      };

      if (input.replyId) {
        deliveryInput.replyId = input.replyId;
      }

      if (result.reasonCode) {
        deliveryInput.reasonCode = result.reasonCode;
      }

      return this.deliveries.recordDelivery(deliveryInput);
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
          source: "whatsapp_reply_send",
          recipient_count: 1,
        },
      });
    }
  }

  private async findDefaultWhatsappChannelAccountId(
    scope: WorkspaceScope,
  ): Promise<string> {
    const account = (await this.channelAccounts.listScoped(scope)).find(
      (item) => item.provider === "whatsapp" && item.status === "connected",
    );

    if (!account) {
      throw new NotFoundError("WhatsApp channel account not found.");
    }

    return account.id;
  }
}
