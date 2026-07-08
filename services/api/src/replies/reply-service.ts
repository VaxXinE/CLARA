import type { AuthContext } from "../auth/auth-context";
import { assertPermission } from "../auth/permissions";
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

      return toReplySendResponseDto(createdReply);
    } catch (error) {
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
