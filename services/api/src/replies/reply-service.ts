import type { AuthContext } from "../auth/auth-context";
import { assertPermission } from "../auth/permissions";
import { AuditLogService } from "../audit/audit-log-service";
import type { ConversationRepository } from "../conversations/conversation-repository";
import { AppError, NotFoundError, ValidationError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import type { GmailOutboundSendService } from "../channels/email/gmail-outbound-send-service";
import { toReplySendResponseDto, type ReplySendResponseDto } from "./reply-dto";
import type { ReplyRepository } from "./reply-repository";
import {
  validateReplyBody,
  type ReplySendProvider,
} from "./reply-send-provider";

export type SendReplyRequest = {
  auth: AuthContext;
  conversationId: string;
  correlationId: string;
  body: string;
  draftId?: string;
};

export type GmailReplySendIntegration = {
  service: Pick<GmailOutboundSendService, "send">;
  providerAccountId: string;
};

function isGmailReplySource(source: string): boolean {
  const normalized = source.trim().toLowerCase();

  return (
    normalized === "email" ||
    normalized === "gmail" ||
    normalized.includes("gmail")
  );
}

function getCustomerEmail(conversation: {
  customer: { contactIdentifier?: string | null };
}): string {
  const email = conversation.customer.contactIdentifier?.trim();

  if (!email) {
    throw new ValidationError("Invalid request.", [
      {
        path: "conversation.customer",
        message: "Gmail conversation customer email is required.",
      },
    ]);
  }

  return email;
}

export class ReplyService {
  constructor(
    private readonly conversationRepository: Pick<
      ConversationRepository,
      "findByIdScoped"
    >,
    private readonly repository: ReplyRepository,
    private readonly provider: ReplySendProvider,
    private readonly auditLogs: AuditLogService,
    private readonly gmailReply?: GmailReplySendIntegration,
  ) {}

  async sendReply(input: SendReplyRequest): Promise<ReplySendResponseDto> {
    assertPermission(input.auth.role, "reply:send");

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const conversation = await this.conversationRepository.findByIdScoped(
      scope,
      input.conversationId,
    );

    if (!conversation) {
      throw new NotFoundError("Conversation not found.");
    }

    let validatedBody: string;

    try {
      validatedBody = validateReplyBody(input.body);
    } catch (error) {
      throw new ValidationError("Invalid request.", [
        {
          path: "body.body",
          message:
            error instanceof Error
              ? error.message === "Reply body is empty."
                ? "Reply body cannot be empty."
                : "Reply body exceeds the maximum length."
              : "Invalid reply body.",
        },
      ]);
    }

    try {
      const attemptedAuditInput = {
        auth: input.auth,
        correlationId: input.correlationId,
        conversationId: conversation.id,
        channelSource: conversation.source,
      } as {
        auth: typeof input.auth;
        correlationId: string;
        conversationId: string;
        channelSource: string;
        draftId?: string;
      };

      if (input.draftId) {
        attemptedAuditInput.draftId = input.draftId;
      }

      await this.auditLogs.recordReplySendAttempted(attemptedAuditInput);

      if (this.gmailReply && isGmailReplySource(conversation.source)) {
        const customerEmail = getCustomerEmail(conversation);

        await this.auditLogs.recordGmailReplySendRequested({
          auth: input.auth,
          correlationId: input.correlationId,
          conversationId: conversation.id,
          recipientCount: 1,
        });

        const gmailResult = await this.gmailReply.service.send({
          actor: {
            userId: input.auth.userId,
            organizationId: input.auth.organizationId,
            workspaceId: input.auth.workspaceId,
            role: input.auth.role,
          },
          message: {
            providerAccountId: this.gmailReply.providerAccountId,
            conversationId: conversation.id,
            to: [customerEmail],
            subject: `Re: ${conversation.id}`,
            textBody: validatedBody,
            idempotencyKey: `reply:${conversation.id}:${input.correlationId}`,
            correlationId: input.correlationId,
          },
        });

        if (gmailResult.status === "failed") {
          await this.auditLogs.recordGmailReplySendResult({
            auth: input.auth,
            correlationId: input.correlationId,
            conversationId: conversation.id,
            status: "failed",
            reasonCode: gmailResult.reason_code ?? null,
            outboundDeliveryId: gmailResult.outbound_delivery_id ?? null,
            recipientCount: 1,
          });

          await this.auditLogs.recordReplyFailed({
            auth: input.auth,
            correlationId: input.correlationId,
            conversationId: conversation.id,
            error: new AppError({
              statusCode: 502,
              appCode: "SEND_FAILED",
              message: "Unable to send reply right now.",
            }),
            ...(input.draftId ? { draftId: input.draftId } : {}),
          });

          return {
            data: {
              send: {
                provider: "gmail",
                status: "failed",
                ...(gmailResult.outbound_delivery_id
                  ? { outbound_delivery_id: gmailResult.outbound_delivery_id }
                  : {}),
                ...(gmailResult.reason_code
                  ? { reason_code: gmailResult.reason_code }
                  : {}),
                ...(gmailResult.correlation_id
                  ? { correlation_id: gmailResult.correlation_id }
                  : {}),
              },
            },
          };
        }

        const createdReply = await this.repository.createReply({
          scope,
          conversationId: conversation.id,
          senderUserId: input.auth.userId,
          body: validatedBody,
          provider: "gmail",
          sendStatus: "sent",
          deliveryStatus:
            gmailResult.status === "simulated" ? "simulated" : "sent",
          ...(input.draftId ? { draftId: input.draftId } : {}),
        });

        await this.auditLogs.recordReplySent({
          auth: input.auth,
          correlationId: input.correlationId,
          conversationId: conversation.id,
          messageId: createdReply.id,
          provider: "gmail",
          deliveryStatus:
            gmailResult.status === "simulated" ? "simulated" : "sent",
          ...(input.draftId ? { draftId: input.draftId } : {}),
        });

        await this.auditLogs.recordGmailReplySendResult({
          auth: input.auth,
          correlationId: input.correlationId,
          conversationId: conversation.id,
          status: gmailResult.status === "simulated" ? "simulated" : "sent",
          reasonCode: gmailResult.reason_code ?? null,
          outboundDeliveryId: gmailResult.outbound_delivery_id ?? null,
          recipientCount: 1,
        });

        return toReplySendResponseDto(createdReply, {
          provider: "gmail",
          status: gmailResult.status === "simulated" ? "simulated" : "sent",
          ...(gmailResult.provider_message_id
            ? { provider_message_id: gmailResult.provider_message_id }
            : {}),
          ...(gmailResult.outbound_delivery_id
            ? { outbound_delivery_id: gmailResult.outbound_delivery_id }
            : {}),
          ...(gmailResult.reason_code
            ? { reason_code: gmailResult.reason_code }
            : {}),
          ...(gmailResult.sent_at ? { sent_at: gmailResult.sent_at } : {}),
          ...(gmailResult.correlation_id
            ? { correlation_id: gmailResult.correlation_id }
            : {}),
        });
      }

      const sendResult = await this.provider.sendReply({
        conversationId: conversation.id,
        source: conversation.source,
        body: validatedBody,
      });

      const repositoryInput = {
        scope,
        conversationId: conversation.id,
        senderUserId: input.auth.userId,
        body: validatedBody,
        provider: sendResult.provider,
        sendStatus: sendResult.status,
        deliveryStatus: sendResult.deliveryStatus,
      } as {
        scope: typeof scope;
        conversationId: string;
        senderUserId: string;
        body: string;
        provider: string;
        sendStatus: "sent";
        deliveryStatus: "sent" | "simulated";
        draftId?: string;
      };

      if (input.draftId) {
        repositoryInput.draftId = input.draftId;
      }

      const createdReply = await this.repository.createReply(repositoryInput);

      const sentAuditInput = {
        auth: input.auth,
        correlationId: input.correlationId,
        conversationId: conversation.id,
        messageId: createdReply.id,
        provider: sendResult.provider,
        deliveryStatus: sendResult.deliveryStatus,
      } as {
        auth: typeof input.auth;
        correlationId: string;
        conversationId: string;
        messageId: string;
        provider: string;
        deliveryStatus: "sent" | "simulated";
        draftId?: string;
      };

      if (input.draftId) {
        sentAuditInput.draftId = input.draftId;
      }

      await this.auditLogs.recordReplySent(sentAuditInput);

      return toReplySendResponseDto(createdReply);
    } catch (error) {
      const failedAuditInput = {
        auth: input.auth,
        correlationId: input.correlationId,
        conversationId: conversation.id,
        error,
      } as {
        auth: typeof input.auth;
        correlationId: string;
        conversationId: string;
        error: unknown;
        draftId?: string;
      };

      if (input.draftId) {
        failedAuditInput.draftId = input.draftId;
      }

      await this.auditLogs.recordReplyFailed(failedAuditInput);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError({
        statusCode: 502,
        appCode: "SEND_FAILED",
        message: "Unable to send reply right now.",
      });
    }
  }
}
