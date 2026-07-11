import { NotFoundError } from "../../errors/app-error";
import type { GmailProviderAccountRepository } from "./gmail-provider-account-repository";
import type { GmailInboundSyncStateService } from "./gmail-inbound-sync-state-service";
import {
  clampGmailInboundSyncMaxMessages,
  type GmailInboundSyncService,
} from "./gmail-inbound-sync-service";
import type {
  GmailInboundSyncJobInput,
  GmailInboundSyncJobResult,
} from "./gmail-inbound-sync-job-types";

export class GmailInboundSyncJobService {
  constructor(
    private readonly accounts: Pick<
      GmailProviderAccountRepository,
      "findByIdScoped"
    >,
    private readonly state: Pick<
      GmailInboundSyncStateService,
      "getByProviderAccountScoped"
    >,
    private readonly sync: Pick<GmailInboundSyncService, "syncMessages">,
  ) {}

  async runJob(
    input: GmailInboundSyncJobInput,
  ): Promise<GmailInboundSyncJobResult> {
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

    const existingState = await this.state.getByProviderAccountScoped(
      scope,
      account.id,
    );

    if (existingState?.lastSyncStatus === "running") {
      return {
        provider_account_id: account.id,
        provider: "gmail",
        trigger: input.trigger,
        status: "skipped",
        reason_code: "connection_unhealthy",
        fetched_count: 0,
        normalized_count: 0,
        persisted_count: 0,
        materialized_count: 0,
        skipped_count: 1,
        failed_count: 0,
        started_at: now.toISOString(),
        finished_at: now.toISOString(),
      };
    }

    const result = await this.sync.syncMessages({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      providerAccountId: account.id,
      ...(input.maxMessages !== undefined
        ? { maxMessages: clampGmailInboundSyncMaxMessages(input.maxMessages) }
        : {}),
      now,
    });

    return {
      provider_account_id: result.provider_account_id,
      provider: result.provider,
      trigger: input.trigger,
      status: result.status,
      ...(result.reason_code !== undefined
        ? { reason_code: result.reason_code }
        : {}),
      fetched_count: result.fetched_count,
      normalized_count: result.normalized_count,
      persisted_count: result.persisted_count,
      materialized_count: result.materialized_count,
      skipped_count: result.skipped_count,
      failed_count: result.failed_count,
      started_at: now.toISOString(),
      finished_at: result.synced_at,
    };
  }
}
