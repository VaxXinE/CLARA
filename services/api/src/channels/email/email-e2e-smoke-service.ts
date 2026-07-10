import { assertPermission } from "../../auth/permissions";
import { AppError, ValidationError } from "../../errors/app-error";
import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type {
  EmailBatchLoadingAdapter,
  EmailChannelAdapter,
} from "./email-channel-adapter";
import { EmailChannelService } from "./email-channel-service";
import { EmailInboundPersistenceService } from "./email-inbound-persistence-service";
import { EmailOutboundDeliveryService } from "./email-outbound-delivery-service";
import { EmailReplyService } from "./email-reply-service";
import type { EmailReplyCommand } from "./email-reply-types";
import type {
  EmailE2ESmokeFailure,
  EmailE2ESmokeReplyInput,
  EmailE2ESmokeResult,
} from "./email-e2e-smoke-types";

type SuccessfulInboundItem = {
  customerId: string;
  conversationId: string;
  activityId: string;
  alreadyProcessed: boolean;
  fromEmail: string;
  toEmail: string;
  subject: string;
  providerThreadId: string | null;
};

function toSafeFailure(index: number, error: unknown): EmailE2ESmokeFailure {
  if (error instanceof AppError) {
    return {
      index,
      code: String(error.appCode),
      message: error.message,
    };
  }

  return {
    index,
    code: "EMAIL_E2E_SMOKE_FAILED",
    message: "Email smoke processing failed for this item.",
  };
}

function buildReplySubject(input: {
  preferredSubject?: string | undefined;
  inboundSubject: string;
}): string {
  const preferredSubject = input.preferredSubject?.trim();

  if (preferredSubject && preferredSubject.length > 0) {
    return preferredSubject;
  }

  const inboundSubject = input.inboundSubject.trim();

  if (inboundSubject.length === 0) {
    return "Re: Support follow-up";
  }

  return inboundSubject.toLowerCase().startsWith("re:")
    ? inboundSubject
    : `Re: ${inboundSubject}`;
}

export class EmailE2ESmokeService<TInboundMessage = unknown> {
  private readonly channelService: EmailChannelService<TInboundMessage>;

  constructor(
    private readonly adapter: EmailChannelAdapter<TInboundMessage>,
    private readonly inboundPersistence: EmailInboundPersistenceService,
    private readonly replyService: EmailReplyService,
    private readonly outboundDeliveryService: EmailOutboundDeliveryService,
  ) {
    this.channelService = new EmailChannelService(adapter);
  }

  async runSmoke(input: {
    scope: WorkspaceScope;
    reply: EmailE2ESmokeReplyInput;
    messages?: TInboundMessage[];
  }): Promise<EmailE2ESmokeResult> {
    assertPermission(input.reply.actorRole, "reply:send");

    const messages = input.messages ?? (await this.loadMessages());
    const failures: EmailE2ESmokeFailure[] = [];
    const successfulItems: SuccessfulInboundItem[] = [];
    let persistedCount = 0;
    let duplicateCount = 0;

    for (const [index, message] of messages.entries()) {
      try {
        const normalized =
          await this.channelService.normalizeInboundMessage(message);
        const persisted = await this.inboundPersistence.persistInboundEmail({
          scope: input.scope,
          email: normalized,
        });

        successfulItems.push({
          customerId: persisted.customerId,
          conversationId: persisted.conversationId,
          activityId: persisted.activityId,
          alreadyProcessed: persisted.alreadyProcessed,
          fromEmail: normalized.fromEmail,
          toEmail: normalized.toEmail,
          subject: normalized.subject,
          providerThreadId: normalized.threadId,
        });

        if (persisted.alreadyProcessed) {
          duplicateCount += 1;
        } else {
          persistedCount += 1;
        }
      } catch (error) {
        failures.push(toSafeFailure(index, error));
      }
    }

    const latestSuccessfulItem = successfulItems.at(-1);

    if (!latestSuccessfulItem) {
      throw new ValidationError(
        "Email smoke requires at least one successfully persisted inbound email.",
      );
    }

    const replyCommand: EmailReplyCommand = {
      organizationId: input.scope.organizationId,
      workspaceId: input.scope.workspaceId,
      conversationId: latestSuccessfulItem.conversationId,
      customerId: latestSuccessfulItem.customerId,
      fromEmail: input.reply.fromEmail?.trim() || latestSuccessfulItem.toEmail,
      toEmail: latestSuccessfulItem.fromEmail,
      subject: buildReplySubject({
        preferredSubject: input.reply.subject,
        inboundSubject: latestSuccessfulItem.subject,
      }),
      textBody: input.reply.textBody,
      providerThreadId: latestSuccessfulItem.providerThreadId,
    };

    if (input.reply.idempotencyKey) {
      replyCommand.idempotencyKey = input.reply.idempotencyKey;
    }

    const replyResult = await this.replyService.sendReply(replyCommand);

    const delivery = await this.outboundDeliveryService.recordReplyResult({
      scope: input.scope,
      conversationId: latestSuccessfulItem.conversationId,
      customerId: latestSuccessfulItem.customerId,
      actorUserId: input.reply.actorUserId,
      idempotencyKey: input.reply.idempotencyKey,
      result: replyResult,
    });

    return {
      scope: input.scope,
      attemptedCount: messages.length,
      persistedCount,
      duplicateCount,
      failedCount: failures.length,
      failures,
      reply: {
        actorUserId: input.reply.actorUserId,
        actorRole: input.reply.actorRole,
        conversationId: latestSuccessfulItem.conversationId,
        customerId: latestSuccessfulItem.customerId,
        result: replyResult,
        delivery,
      },
    };
  }

  private async loadMessages(): Promise<TInboundMessage[]> {
    const loadingAdapter = this
      .adapter as EmailBatchLoadingAdapter<TInboundMessage>;

    if (typeof loadingAdapter.loadInboundMessages !== "function") {
      throw new ValidationError(
        "Email smoke adapter does not support batch loading.",
      );
    }

    return loadingAdapter.loadInboundMessages();
  }
}
