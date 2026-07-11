import { describe, expect, it, vi } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import { GmailInboundSyncSchedulerRuntimeService } from "../src/channels/email/gmail-inbound-sync-scheduler-runtime-service";
import type { GmailInboundSyncSchedulerService } from "../src/channels/email/gmail-inbound-sync-scheduler-service";
import type { GmailInboundSyncSchedulerRuntimeTickResult } from "../src/channels/email/gmail-inbound-sync-scheduler-runtime-types";
import type { GmailInboundSyncSchedulerTickResult } from "../src/channels/email/gmail-inbound-sync-scheduler-types";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

function authHeaders(role: "owner" | "agent" | "viewer") {
  return {
    "x-mock-user-id": `usr_demo_${role}`,
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": role,
  };
}

function tickResult(
  status: GmailInboundSyncSchedulerRuntimeTickResult["status"] = "completed",
): GmailInboundSyncSchedulerRuntimeTickResult {
  return {
    status,
    checked_account_count: 1,
    scheduled_job_count: status === "completed" ? 1 : 0,
    skipped_count: status === "skipped" ? 1 : 0,
    failed_count: status === "failed" ? 1 : 0,
    started_at: "2026-07-11T11:00:00.000Z",
    finished_at: "2026-07-11T11:01:00.000Z",
  };
}

describe("POST /api/v1/integrations/gmail/scheduler/tick", () => {
  it("requires auth and blocks viewer", async () => {
    const scheduler = {
      getStatus: () => ({
        scheduler_enabled: true,
        scheduler_running: false,
        interval_ms: 300000,
        max_accounts_per_tick: 10,
        max_messages_per_account: 25,
      }),
      tickNow: vi.fn(async () => tickResult()),
    };
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncSchedulerStatus: scheduler,
    });

    const unauthenticated = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/scheduler/tick",
    });
    const viewer = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/scheduler/tick",
      headers: authHeaders("viewer"),
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(viewer.statusCode).toBe(403);
    expect(scheduler.tickNow).not.toHaveBeenCalled();
  });

  it("allows agent to trigger one safe manual tick without lifecycle start", async () => {
    const scheduler = {
      start: vi.fn(() => true),
      getStatus: () => ({
        scheduler_enabled: true,
        scheduler_running: false,
        interval_ms: 300000,
        max_accounts_per_tick: 10,
        max_messages_per_account: 25,
      }),
      tickNow: vi.fn(async () => tickResult()),
    };
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncSchedulerStatus: scheduler,
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/scheduler/tick",
      headers: authHeaders("agent"),
    });

    await app.close();

    const body = response.json();
    const serialized = JSON.stringify(body);

    expect(response.statusCode).toBe(200);
    expect(scheduler.start).not.toHaveBeenCalled();
    expect(scheduler.tickNow).toHaveBeenCalledTimes(1);
    expect(body).toMatchObject({
      data: {
        status: "completed",
        checked_account_count: 1,
        scheduled_job_count: 1,
        scheduler_running: false,
      },
    });
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("raw Gmail");
    expect(serialized).not.toContain("provider_raw_error");
    expect(serialized).not.toContain("client_secret");
  });

  it("rejects scope spoofing and unknown body fields", async () => {
    const scheduler = {
      getStatus: () => ({
        scheduler_enabled: true,
        scheduler_running: false,
        interval_ms: 300000,
        max_accounts_per_tick: 10,
        max_messages_per_account: 25,
      }),
      tickNow: vi.fn(async () => tickResult()),
    };
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncSchedulerStatus: scheduler,
    });

    const spoofed = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/scheduler/tick",
      headers: authHeaders("owner"),
      payload: {
        organization_id: "evil",
        workspace_id: "evil",
      },
    });
    const unknown = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/scheduler/tick",
      headers: authHeaders("owner"),
      payload: {
        dry_run: true,
      },
    });

    await app.close();

    expect(spoofed.statusCode).toBe(400);
    expect(unknown.statusCode).toBe(400);
    expect(scheduler.tickNow).not.toHaveBeenCalled();
  });

  it("returns disabled and skipped summaries safely", async () => {
    const scheduler = {
      getStatus: () => ({
        scheduler_enabled: false,
        scheduler_running: false,
        interval_ms: 300000,
        max_accounts_per_tick: 10,
        max_messages_per_account: 25,
      }),
      tickNow: vi
        .fn()
        .mockResolvedValueOnce({
          ...tickResult("disabled"),
          reason_code: "runtime_disabled",
        })
        .mockResolvedValueOnce({
          ...tickResult("skipped"),
          reason_code: "tick_already_running",
        }),
    };
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncSchedulerStatus: scheduler,
    });

    const disabled = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/scheduler/tick",
      headers: authHeaders("owner"),
    });
    const skipped = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/scheduler/tick",
      headers: authHeaders("owner"),
    });

    await app.close();

    expect(disabled.json()).toMatchObject({
      data: {
        status: "disabled",
        reason_code: "runtime_disabled",
      },
    });
    expect(skipped.json()).toMatchObject({
      data: {
        status: "skipped",
        reason_code: "tick_already_running",
      },
    });
  });

  it("passes clamped manual limits to the runtime scheduler", async () => {
    const tickOnce = vi.fn(
      async (): Promise<GmailInboundSyncSchedulerTickResult> => ({
        status: "completed",
        checked_account_count: 1,
        scheduled_job_count: 1,
        skipped_count: 0,
        failed_count: 0,
        started_at: "2026-07-11T11:00:00.000Z",
        finished_at: "2026-07-11T11:01:00.000Z",
      }),
    );
    const runtime = new GmailInboundSyncSchedulerRuntimeService(
      {
        tickOnce,
      } satisfies Pick<GmailInboundSyncSchedulerService, "tickOnce">,
      {
        enabled: true,
      },
    );
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncSchedulerStatus: runtime,
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/scheduler/tick",
      headers: authHeaders("agent"),
      payload: {
        max_accounts_per_tick: 999,
        max_messages_per_account: 999,
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(tickOnce).toHaveBeenCalledWith(
      expect.objectContaining({
        maxAccountsPerTick: 50,
        maxMessagesPerAccount: 25,
      }),
    );
  });
});
