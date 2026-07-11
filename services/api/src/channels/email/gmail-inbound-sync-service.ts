import { AppError, NotFoundError } from "../../errors/app-error";
import type { GmailConnectionHealthService } from "./gmail-connection-health-service";
import type { EmailInboundMaterializer } from "./email-inbound-materialization-types";
import type { GmailInboundMessageFetchService } from "./gmail-inbound-message-fetch-service";
import type { GmailMessageNormalizationService } from "./gmail-message-normalization-service";
import type { GmailNormalizedInboundEmailPersister } from "./gmail-message-normalization-types";
import type { GmailProviderAccountRepository } from "./gmail-provider-account-repository";
import type {
  GmailInboundSyncInput,
  GmailInboundSyncReasonCode,
  GmailInboundSyncResultDto,
} from "./gmail-inbound-sync-types";

const DEFAULT_SYNC_MAX_MESSAGES = 10;
const SYNC_MAX_MESSAGES_LIMIT = 25;

export type GmailConnectionHealthChecker = Pick<
  GmailConnectionHealthService,
  "checkHealth"
>;

export type GmailInboundMessageFetcher = Pick<
  GmailInboundMessageFetchService,
  "listMessages" | "getMessage"
>;

function clampMaxMessages(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) {
    return DEFAULT_SYNC_MAX_MESSAGES;
  }

  return Math.min(Math.max(Math.trunc(value), 1), SYNC_MAX_MESSAGES_LIMIT);
}

export class GmailInboundSyncService {
  constructor(
    private readonly accounts: GmailProviderAccountRepository,
    private readonly health: GmailConnectionHealthChecker,
    private readonly fetch: GmailInboundMessageFetcher,
    private readonly options: {
      normalization?: Pick<
        GmailMessageNormalizationService,
        "normalizeMessage"
      >;
      persistence?: GmailNormalizedInboundEmailPersister;
      materialization?: EmailInboundMaterializer;
    } = {},
  ) {}

  async syncMessages(
    input: GmailInboundSyncInput,
  ): Promise<GmailInboundSyncResultDto> {
    const scope = {
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
    } as const;
    const now = input.now ?? new Date();
    const account = await this.accounts.findByIdScoped(
      scope,
      input.providerAccountId,
    );

    if (!account) {
      throw new NotFoundError("Gmail provider account not found.");
    }

    const health = await this.health.checkHealth({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      providerAccountId: account.id,
      now,
    });

    if (health.status !== "healthy") {
      return {
        provider_account_id: account.id,
        provider: "gmail",
        status: "skipped",
        fetched_count: 0,
        normalized_count: 0,
        persisted_count: 0,
        materialized_count: 0,
        skipped_count: 0,
        failed_count: 0,
        reason_code: "connection_unhealthy",
        synced_at: now.toISOString(),
      };
    }

    let listed;

    try {
      listed = await this.fetch.listMessages({
        organizationId: scope.organizationId,
        workspaceId: scope.workspaceId,
        accountId: account.id,
        maxResults: clampMaxMessages(input.maxMessages),
        ...(input.pageToken ? { pageToken: input.pageToken } : {}),
        ...(input.query ? { query: input.query } : {}),
        ...(input.labelIds ? { labelIds: input.labelIds } : {}),
        now,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return {
          provider_account_id: account.id,
          provider: "gmail",
          status: "failed",
          fetched_count: 0,
          normalized_count: 0,
          persisted_count: 0,
          materialized_count: 0,
          skipped_count: 0,
          failed_count: 0,
          reason_code: "provider_fetch_failed",
          synced_at: now.toISOString(),
        };
      }

      throw error;
    }

    if (listed.items.length === 0) {
      return {
        provider_account_id: account.id,
        provider: "gmail",
        status: "completed",
        fetched_count: 0,
        normalized_count: 0,
        persisted_count: 0,
        materialized_count: 0,
        skipped_count: 0,
        failed_count: 0,
        ...(listed.next_page_token
          ? {
              next_page_token: listed.next_page_token,
            }
          : {}),
        reason_code: "no_messages",
        synced_at: now.toISOString(),
      };
    }

    let fetchedCount = 0;
    let normalizedCount = 0;
    let persistedCount = 0;
    let materializedCount = 0;
    let failedCount = 0;
    let skippedCount = 0;
    let reasonCode: GmailInboundSyncReasonCode | undefined = "sync_completed";

    for (const item of listed.items) {
      try {
        const message = await this.fetch.getMessage({
          organizationId: scope.organizationId,
          workspaceId: scope.workspaceId,
          accountId: account.id,
          providerMessageId: item.provider_message_id,
          now,
        });
        fetchedCount += 1;

        if (input.persistNormalized || input.materializeConversation) {
          const normalization = this.options.normalization;

          if (!normalization) {
            throw new AppError({
              statusCode: 400,
              appCode: "GMAIL_MESSAGE_NORMALIZATION_NOT_CONFIGURED",
              message: "Gmail message normalization is not configured.",
            });
          }

          const envelope = normalization.normalizeMessage({
            account,
            message,
            now,
          });
          normalizedCount += 1;

          let itemSkipped = false;

          if (input.persistNormalized) {
            const persistence = this.options.persistence;

            if (!persistence) {
              throw new AppError({
                statusCode: 400,
                appCode: "GMAIL_NORMALIZED_PERSISTENCE_NOT_CONFIGURED",
                message:
                  "Gmail normalized inbound persistence is not configured.",
              });
            }

            const persisted = await persistence.persistNormalizedEmail({
              scope,
              envelope,
            });

            if (persisted.alreadyProcessed) {
              itemSkipped = true;
            } else {
              persistedCount += 1;
            }
          }

          if (input.materializeConversation) {
            const materialization = this.options.materialization;

            if (!materialization) {
              throw new AppError({
                statusCode: 400,
                appCode: "EMAIL_INBOUND_MATERIALIZATION_NOT_CONFIGURED",
                message: "Email inbound materialization is not configured.",
              });
            }

            const materialized = await materialization.materialize({
              scope,
              envelope,
            });

            if (materialized.alreadyProcessed) {
              itemSkipped = true;
            } else {
              materializedCount += 1;
            }
          }

          if (itemSkipped) {
            skippedCount += 1;
          }
        }
      } catch (error) {
        if (error instanceof AppError && error.statusCode === 400) {
          skippedCount += 1;
        } else {
          failedCount += 1;
          reasonCode = "message_fetch_failed";
        }
      }
    }

    const status =
      fetchedCount > 0 && failedCount === 0 && skippedCount === 0
        ? "completed"
        : fetchedCount > 0 || skippedCount > 0
          ? "partial"
          : "failed";

    return {
      provider_account_id: account.id,
      provider: "gmail",
      status,
      fetched_count: fetchedCount,
      normalized_count: normalizedCount,
      persisted_count: persistedCount,
      materialized_count: materializedCount,
      skipped_count: skippedCount,
      failed_count: failedCount,
      ...(listed.next_page_token
        ? {
            next_page_token: listed.next_page_token,
          }
        : {}),
      ...(reasonCode
        ? {
            reason_code: reasonCode,
          }
        : {}),
      synced_at: now.toISOString(),
    };
  }
}
