import { AppError } from "../../errors/app-error";
import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type {
  EmailBatchLoadingAdapter,
  EmailChannelAdapter,
} from "./email-channel-adapter";
import { EmailChannelService } from "./email-channel-service";
import { EmailInboundPersistenceService } from "./email-inbound-persistence-service";
import type {
  EmailIngestionBatchResult,
  EmailIngestionFailure,
} from "./email-ingestion-types";

function toSafeFailure(index: number, error: unknown): EmailIngestionFailure {
  if (error instanceof AppError) {
    return {
      index,
      code: String(error.appCode),
      message: error.message,
    };
  }

  return {
    index,
    code: "EMAIL_INGESTION_FAILED",
    message: "Email ingestion failed for this item.",
  };
}

export class EmailIngestionService<TInboundMessage = unknown> {
  private readonly channelService: EmailChannelService<TInboundMessage>;

  constructor(
    private readonly adapter: EmailChannelAdapter<TInboundMessage>,
    private readonly persistence: EmailInboundPersistenceService,
  ) {
    this.channelService = new EmailChannelService(adapter);
  }

  async ingestMessages(input: {
    scope: WorkspaceScope;
    messages: TInboundMessage[];
  }): Promise<EmailIngestionBatchResult> {
    const failures: EmailIngestionFailure[] = [];
    let persistedCount = 0;
    let duplicateCount = 0;

    for (const [index, message] of input.messages.entries()) {
      try {
        const normalized =
          await this.channelService.normalizeInboundMessage(message);
        const persisted = await this.persistence.persistInboundEmail({
          scope: input.scope,
          email: normalized,
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

    return {
      attemptedCount: input.messages.length,
      persistedCount,
      duplicateCount,
      failedCount: failures.length,
      failures,
    };
  }

  async ingestAvailableMessages(input: {
    scope: WorkspaceScope;
  }): Promise<EmailIngestionBatchResult> {
    const loadingAdapter = this
      .adapter as EmailBatchLoadingAdapter<TInboundMessage>;

    if (typeof loadingAdapter.loadInboundMessages !== "function") {
      throw new Error(
        "Email adapter does not support batch loading for ingestion.",
      );
    }

    const messages = await loadingAdapter.loadInboundMessages();

    return this.ingestMessages({
      scope: input.scope,
      messages,
    });
  }
}
