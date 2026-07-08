import type { AuthContext } from "../auth/auth-context";
import { assertPermission } from "../auth/permissions";
import { AuditLogService } from "../audit/audit-log-service";
import type { ConversationRepository } from "../conversations/conversation-repository";
import { AppError, NotFoundError, ValidationError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
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

export class ReplyService {
  constructor(
    private readonly conversationRepository: Pick<
      ConversationRepository,
      "findByIdScoped"
    >,
    private readonly repository: ReplyRepository,
    private readonly provider: ReplySendProvider,
    private readonly auditLogs: AuditLogService,
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
