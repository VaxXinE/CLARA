import { describe, expect, it, vi } from "vitest";
import { AuditLogService } from "../src/audit/audit-log-service";
import type { AuditLogRepository } from "../src/audit/audit-log-repository";
import { buildAuthContext } from "../src/auth/auth-context";
import { AppError } from "../src/errors/app-error";

function createAuth(role: "owner" | "agent" | "viewer" = "agent") {
  return buildAuthContext({
    userId: "usr_demo_agent",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    role,
  });
}

describe("AuditLogService", () => {
  it("records allowlisted metadata for AI draft generation", async () => {
    const create = vi.fn(async () => undefined);
    const service = new AuditLogService({
      create,
    } satisfies AuditLogRepository);

    const recorded = await service.recordAiDraftGenerated({
      auth: createAuth(),
      correlationId: "corr_demo_001",
      conversationId: "conv_demo_budi_stock",
      draftId: "draft_demo_001",
      provider: "mock",
      model: "mock-clara-draft-v1",
      promptVersion: "mvp_reply_draft_v1",
      latencyMs: 84,
    });

    expect(recorded).toBe(true);
    expect(create).toHaveBeenCalledWith({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "agent",
      action: "ai_draft.generated",
      resourceType: "reply_draft",
      resourceId: "draft_demo_001",
      outcome: "success",
      metadata: {
        conversation_id: "conv_demo_budi_stock",
        provider: "mock",
        model: "mock-clara-draft-v1",
        prompt_version: "mvp_reply_draft_v1",
        latency_ms: 84,
      },
      correlationId: "corr_demo_001",
    });
  });

  it("returns false instead of throwing when audit persistence fails", async () => {
    const service = new AuditLogService({
      create: vi.fn(async () => {
        throw new Error("db exploded");
      }),
    });

    await expect(
      service.recordReplySendAttempted({
        auth: createAuth(),
        correlationId: "corr_demo_002",
        conversationId: "conv_demo_budi_stock",
        channelSource: "whatsapp_demo",
        draftId: "draft_demo_001",
      }),
    ).resolves.toBe(false);
  });

  it("stores safe error codes only for failed reply send", async () => {
    const create = vi.fn(async () => undefined);
    const service = new AuditLogService({
      create,
    } satisfies AuditLogRepository);

    await service.recordReplyFailed({
      auth: createAuth(),
      correlationId: "corr_demo_003",
      conversationId: "conv_demo_budi_stock",
      draftId: "draft_demo_001",
      provider: "simulated",
      error: new AppError({
        statusCode: 502,
        appCode: "SEND_FAILED",
        message: "Sensitive upstream details must not be stored.",
      }),
    });

    expect(create).toHaveBeenCalledWith({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "agent",
      action: "reply.failed",
      resourceType: "conversation",
      resourceId: "conv_demo_budi_stock",
      outcome: "failure",
      metadata: {
        draft_id: "draft_demo_001",
        provider: "simulated",
        error_code: "SEND_FAILED",
      },
      correlationId: "corr_demo_003",
    });
  });

  it("records safe Gmail scheduler operator metadata", async () => {
    const create = vi.fn(async () => undefined);
    const service = new AuditLogService({
      create,
    } satisfies AuditLogRepository);

    await service.recordGmailSchedulerOperatorAction({
      auth: createAuth("owner"),
      correlationId: "corr_demo_scheduler",
      action: "gmail.scheduler.tick_completed",
      status: "completed",
      checkedAccountCount: 2,
      scheduledJobCount: 1,
      skippedCount: 1,
      failedCount: 0,
    });

    expect(create).toHaveBeenCalledWith({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      actorUserId: "usr_demo_agent",
      actorRole: "owner",
      action: "gmail.scheduler.tick_completed",
      resourceType: "gmail_scheduler",
      resourceId: "gmail_inbound_scheduler",
      outcome: "success",
      metadata: {
        provider: "gmail",
        status: "completed",
        checked_account_count: 2,
        scheduled_job_count: 1,
        skipped_count: 1,
        failed_count: 0,
      },
      correlationId: "corr_demo_scheduler",
    });

    expect(JSON.stringify(create.mock.calls)).not.toContain("access_token");
    expect(JSON.stringify(create.mock.calls)).not.toContain("refresh_token");
    expect(JSON.stringify(create.mock.calls)).not.toContain("Authorization");
    expect(JSON.stringify(create.mock.calls)).not.toContain("raw Gmail");
    expect(JSON.stringify(create.mock.calls)).not.toContain("client_secret");
  });
});
