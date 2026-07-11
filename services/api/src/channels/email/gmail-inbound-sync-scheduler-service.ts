import type { GmailProviderAccountRepository } from "./gmail-provider-account-repository";
import type { GmailInboundSyncJobService } from "./gmail-inbound-sync-job-service";
import { clampGmailInboundSyncMaxMessages } from "./gmail-inbound-sync-service";
import type { GmailInboundSyncStateService } from "./gmail-inbound-sync-state-service";
import type {
  GmailInboundSyncSchedulerConfig,
  GmailInboundSyncSchedulerTickResult,
} from "./gmail-inbound-sync-scheduler-types";

export const DEFAULT_GMAIL_INBOUND_SYNC_SCHEDULER_MAX_ACCOUNTS_PER_TICK = 10;

export function clampGmailInboundSyncSchedulerMaxAccountsPerTick(
  value: number | undefined,
): number {
  if (value === undefined || !Number.isFinite(value)) {
    return DEFAULT_GMAIL_INBOUND_SYNC_SCHEDULER_MAX_ACCOUNTS_PER_TICK;
  }

  return Math.min(Math.max(Math.trunc(value), 1), 50);
}

export class GmailInboundSyncSchedulerService {
  constructor(
    private readonly accounts: Pick<
      GmailProviderAccountRepository,
      "listEligibleForScheduler"
    >,
    private readonly state: Pick<
      GmailInboundSyncStateService,
      "getByProviderAccountScoped"
    >,
    private readonly jobs: Pick<GmailInboundSyncJobService, "runJob">,
    private readonly config: GmailInboundSyncSchedulerConfig = {},
  ) {}

  async tickOnce(
    input: {
      now?: Date;
      maxAccountsPerTick?: number;
      maxMessagesPerAccount?: number;
    } = {},
  ): Promise<GmailInboundSyncSchedulerTickResult> {
    const startedAt = input.now ?? new Date();

    if (this.config.enabled !== true) {
      return {
        status: "disabled",
        checked_account_count: 0,
        scheduled_job_count: 0,
        skipped_count: 0,
        failed_count: 0,
        started_at: startedAt.toISOString(),
        finished_at: startedAt.toISOString(),
        reason_code: "scheduler_disabled",
      };
    }

    const maxAccounts = clampGmailInboundSyncSchedulerMaxAccountsPerTick(
      input.maxAccountsPerTick ?? this.config.maxAccountsPerTick,
    );
    const maxMessages = clampGmailInboundSyncMaxMessages(
      input.maxMessagesPerAccount ?? this.config.maxMessagesPerAccount,
    );
    const eligibleAccounts =
      await this.accounts.listEligibleForScheduler(maxAccounts);
    let scheduledJobCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const account of eligibleAccounts) {
      const existingState = await this.state.getByProviderAccountScoped(
        {
          organizationId: account.organizationId,
          workspaceId: account.workspaceId,
        },
        account.providerAccountId,
      );

      if (existingState?.lastSyncStatus === "running") {
        skippedCount += 1;
        continue;
      }

      const result = await this.jobs.runJob({
        organizationId: account.organizationId,
        workspaceId: account.workspaceId,
        providerAccountId: account.providerAccountId,
        trigger: "scheduler_preview",
        maxMessages,
        now: startedAt,
      });

      if (result.status === "skipped") {
        skippedCount += 1;
      } else {
        scheduledJobCount += 1;
      }

      if (result.status === "failed" || result.failed_count > 0) {
        failedCount += 1;
      }
    }

    const finishedAt = new Date();
    const status =
      failedCount > 0
        ? scheduledJobCount > 0
          ? "partial"
          : "failed"
        : "completed";

    return {
      status,
      checked_account_count: eligibleAccounts.length,
      scheduled_job_count: scheduledJobCount,
      skipped_count: skippedCount,
      failed_count: failedCount,
      started_at: startedAt.toISOString(),
      finished_at: finishedAt.toISOString(),
    };
  }
}
