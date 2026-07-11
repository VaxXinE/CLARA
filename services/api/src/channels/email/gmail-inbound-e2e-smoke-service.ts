import type { GmailInboundSyncService } from "./gmail-inbound-sync-service";
import type {
  GmailInboundE2ESmokeInput,
  GmailInboundE2ESmokeReasonCode,
  GmailInboundE2ESmokeResultDto,
} from "./gmail-inbound-e2e-smoke-types";

function toSmokeReasonCode(
  value: string | undefined,
): GmailInboundE2ESmokeReasonCode | undefined {
  if (
    value === "no_messages" ||
    value === "connection_unhealthy" ||
    value === "provider_fetch_failed" ||
    value === "message_fetch_failed"
  ) {
    return value;
  }

  return undefined;
}

export class GmailInboundE2ESmokeService {
  constructor(
    private readonly sync: Pick<GmailInboundSyncService, "syncMessages">,
  ) {}

  async runSmoke(
    input: GmailInboundE2ESmokeInput,
  ): Promise<GmailInboundE2ESmokeResultDto> {
    const now = input.now ?? new Date();
    const result = await this.sync.syncMessages({
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      providerAccountId: input.providerAccountId,
      ...(input.maxMessages !== undefined
        ? { maxMessages: input.maxMessages }
        : {}),
      ...(input.pageToken !== undefined ? { pageToken: input.pageToken } : {}),
      ...(input.query !== undefined ? { query: input.query } : {}),
      ...(input.labelIds !== undefined ? { labelIds: input.labelIds } : {}),
      persistNormalized: true,
      materializeConversation: true,
      now,
    });

    const passed =
      result.failed_count === 0 &&
      (result.status === "completed" || result.status === "partial") &&
      (result.materialized_count > 0 || result.skipped_count > 0);
    const failedReasonCode = toSmokeReasonCode(result.reason_code);

    const response: GmailInboundE2ESmokeResultDto = {
      status: passed ? "passed" : "failed",
      provider_account_id: result.provider_account_id,
      fetched_count: result.fetched_count,
      normalized_count: result.normalized_count,
      persisted_count: result.persisted_count,
      materialized_count: result.materialized_count,
      skipped_count: result.skipped_count,
      failed_count: result.failed_count,
      checked_at: now.toISOString(),
    };

    if (passed) {
      response.reason_code = "ok";
    } else if (failedReasonCode !== undefined) {
      response.reason_code = failedReasonCode;
    }

    return response;
  }
}
