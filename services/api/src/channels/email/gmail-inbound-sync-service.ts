import { AppError, NotFoundError } from "../../errors/app-error";
import type { GmailConnectionHealthService } from "./gmail-connection-health-service";
import type { EmailInboundMaterializer } from "./email-inbound-materialization-types";
import type { GmailInboundMessageFetchService } from "./gmail-inbound-message-fetch-service";
import type { GmailMessageNormalizationService } from "./gmail-message-normalization-service";
import type { GmailNormalizedInboundEmailPersister } from "./gmail-message-normalization-types";
import type { GmailProviderAccountRepository } from "./gmail-provider-account-repository";
import type { GmailInboundSyncStateService } from "./gmail-inbound-sync-state-service";
import type {
  GmailInboundSyncInput,
  GmailInboundSyncReasonCode,
  GmailInboundSyncResultDto,
} from "./gmail-inbound-sync-types";

const DEFAULT_SYNC_MAX_MESSAGES = 10;
export const GMAIL_INBOUND_SYNC_MAX_MESSAGES_LIMIT = 25;

export type GmailConnectionHealthChecker = Pick<
  GmailConnectionHealthService,
  "checkHealth"
>;

export type GmailInboundMessageFetcher = Pick<
  GmailInboundMessageFetchService,
  "listMessages" | "getMessage"
>;

export function clampGmailInboundSyncMaxMessages(
  value: number | undefined,
): number {
  if (value === undefined || !Number.isFinite(value)) {
    return DEFAULT_SYNC_MAX_MESSAGES;
  }

  return Math.min(
    Math.max(Math.trunc(value), 1),
    GMAIL_INBOUND_SYNC_MAX_MESSAGES_LIMIT,
  );
}

function toSyncStateDto(state: {
  lastSyncStatus: "idle" | "running" | "completed" | "partial" | "failed";
  lastStartedAt: Date | null;
  lastCompletedAt: Date | null;
  lastFailedAt: Date | null;
  lastFailureReasonCode:
    | "connection_unhealthy"
    | "provider_fetch_failed"
    | "message_fetch_failed"
    | "no_messages"
    | null;
}): GmailInboundSyncResultDto["sync_state"] {
  return {
    status: state.lastSyncStatus,
    last_started_at: state.lastStartedAt?.toISOString() ?? null,
    last_completed_at: state.lastCompletedAt?.toISOString() ?? null,
    last_failed_at: state.lastFailedAt?.toISOString() ?? null,
    last_failure_reason_code: state.lastFailureReasonCode,
  };
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
      state?: Pick<
        GmailInboundSyncStateService,
        | "markStarted"
        | "markCompleted"
        | "markPartial"
        | "markFailed"
        | "updateCursor"
      >;
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

    const startedState = await this.options.state?.markStarted({
      scope,
      providerAccountId: account.id,
      now,
    });

    const accountHistoryId =
      typeof account.metadata.historyId === "string"
        ? account.metadata.historyId.trim() || null
        : null;

    const health = await this.health.checkHealth({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      providerAccountId: account.id,
      now,
    });

    if (health.status !== "healthy") {
      const result: GmailInboundSyncResultDto = {
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
        sync_state: startedState
          ? toSyncStateDto(startedState)
          : {
              status: "failed",
              last_started_at: now.toISOString(),
              last_completed_at: null,
              last_failed_at: now.toISOString(),
              last_failure_reason_code: "connection_unhealthy",
            },
        synced_at: now.toISOString(),
      };

      const failedState = await this.options.state?.markFailed({
        scope,
        providerAccountId: account.id,
        reasonCode: "connection_unhealthy",
        now,
      });

      result.sync_state = failedState
        ? toSyncStateDto(failedState)
        : result.sync_state;

      return result;
    }

    let listed;

    try {
      listed = await this.fetch.listMessages({
        organizationId: scope.organizationId,
        workspaceId: scope.workspaceId,
        accountId: account.id,
        maxResults: clampGmailInboundSyncMaxMessages(input.maxMessages),
        ...(input.pageToken ? { pageToken: input.pageToken } : {}),
        ...(input.query ? { query: input.query } : {}),
        ...(input.labelIds ? { labelIds: input.labelIds } : {}),
        now,
      });
    } catch (error) {
      if (error instanceof AppError) {
        const result: GmailInboundSyncResultDto = {
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
          sync_state: startedState
            ? toSyncStateDto(startedState)
            : {
                status: "failed",
                last_started_at: now.toISOString(),
                last_completed_at: null,
                last_failed_at: now.toISOString(),
                last_failure_reason_code: "provider_fetch_failed",
              },
          synced_at: now.toISOString(),
        };

        const failedState = await this.options.state?.markFailed({
          scope,
          providerAccountId: account.id,
          reasonCode: "provider_fetch_failed",
          now,
        });

        result.sync_state = failedState
          ? toSyncStateDto(failedState)
          : result.sync_state;

        return result;
      }

      throw error;
    }

    if (listed.items.length === 0) {
      const result: GmailInboundSyncResultDto = {
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
        ...(accountHistoryId ? { last_history_id: accountHistoryId } : {}),
        reason_code: "no_messages",
        sync_state: startedState
          ? toSyncStateDto(startedState)
          : {
              status: "completed",
              last_started_at: now.toISOString(),
              last_completed_at: now.toISOString(),
              last_failed_at: null,
              last_failure_reason_code: null,
            },
        synced_at: now.toISOString(),
      };

      const completedState = await this.options.state?.markCompleted({
        scope,
        providerAccountId: account.id,
        counters: {
          fetchedCount: 0,
          normalizedCount: 0,
          persistedCount: 0,
          materializedCount: 0,
        },
        lastHistoryId: accountHistoryId,
        lastPageToken: listed.next_page_token ?? null,
        now,
      });

      result.sync_state = completedState
        ? toSyncStateDto(completedState)
        : result.sync_state;

      return result;
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

    const result: GmailInboundSyncResultDto = {
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
      ...(accountHistoryId ? { last_history_id: accountHistoryId } : {}),
      ...(reasonCode
        ? {
            reason_code: reasonCode,
          }
        : {}),
      sync_state: startedState
        ? toSyncStateDto(startedState)
        : {
            status,
            last_started_at: now.toISOString(),
            last_completed_at: status === "failed" ? null : now.toISOString(),
            last_failed_at: status === "failed" ? now.toISOString() : null,
            last_failure_reason_code:
              status === "failed" ? "message_fetch_failed" : null,
          },
      synced_at: now.toISOString(),
    };

    const counters = {
      fetchedCount,
      normalizedCount,
      persistedCount,
      materializedCount,
    };

    if (status === "completed") {
      const completedState = await this.options.state?.markCompleted({
        scope,
        providerAccountId: account.id,
        counters,
        lastHistoryId: accountHistoryId,
        lastPageToken: listed.next_page_token ?? null,
        now,
      });
      result.sync_state = completedState
        ? toSyncStateDto(completedState)
        : result.sync_state;
    } else if (status === "partial") {
      const partialState = await this.options.state?.markPartial({
        scope,
        providerAccountId: account.id,
        counters,
        reasonCode:
          reasonCode === "sync_completed" ? null : (reasonCode ?? null),
        lastHistoryId: accountHistoryId,
        lastPageToken: listed.next_page_token ?? null,
        now,
      });
      result.sync_state = partialState
        ? toSyncStateDto(partialState)
        : result.sync_state;
    } else {
      const failedState = await this.options.state?.markFailed({
        scope,
        providerAccountId: account.id,
        reasonCode: "message_fetch_failed",
        counters,
        now,
      });
      result.sync_state = failedState
        ? toSyncStateDto(failedState)
        : result.sync_state;
    }

    return result;
  }
}
