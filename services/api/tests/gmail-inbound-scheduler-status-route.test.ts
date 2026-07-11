import { describe, expect, it, vi } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import type { GmailInboundSyncSchedulerRuntimeStatusDto } from "../src/channels/email/gmail-inbound-sync-scheduler-runtime-types";

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

function createStatusService(
  status: GmailInboundSyncSchedulerRuntimeStatusDto,
) {
  return {
    getStatus: () => status,
  };
}

describe("GET /api/v1/integrations/gmail/scheduler/status", () => {
  it("requires auth and blocks viewer", async () => {
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncSchedulerStatus: createStatusService({
        scheduler_enabled: false,
        scheduler_running: false,
        interval_ms: 300000,
        max_accounts_per_tick: 10,
        max_messages_per_account: 25,
      }),
    });

    const unauthenticated = await app.inject({
      method: "GET",
      url: "/api/v1/integrations/gmail/scheduler/status",
    });
    const viewer = await app.inject({
      method: "GET",
      url: "/api/v1/integrations/gmail/scheduler/status",
      headers: authHeaders("viewer"),
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(viewer.statusCode).toBe(403);
  });

  it("allows agent to read disabled scheduler status safely", async () => {
    const recordGmailSchedulerOperatorAction = vi.fn(async () => true);
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncSchedulerStatus: createStatusService({
        scheduler_enabled: false,
        scheduler_running: false,
        interval_ms: 300000,
        max_accounts_per_tick: 10,
        max_messages_per_account: 25,
        last_reason_code: "runtime_disabled",
      }),
      gmailSchedulerAuditLogService: {
        recordGmailSchedulerOperatorAction,
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/integrations/gmail/scheduler/status?organization_id=evil&workspace_id=evil",
      headers: authHeaders("agent"),
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(recordGmailSchedulerOperatorAction).toHaveBeenCalledWith(
      expect.objectContaining({
        correlationId: expect.any(String),
        action: "gmail.scheduler.status_read",
        status: "not_running",
        reasonCode: "runtime_disabled",
      }),
    );
    expect(response.json()).toEqual({
      data: {
        scheduler_enabled: false,
        scheduler_running: false,
        interval_ms: 300000,
        max_accounts_per_tick: 10,
        max_messages_per_account: 25,
        last_reason_code: "runtime_disabled",
      },
    });
  });

  it("allows owner to read enabled scheduler status safely", async () => {
    const recordGmailSchedulerOperatorAction = vi.fn(async () => true);
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncSchedulerStatus: createStatusService({
        scheduler_enabled: true,
        scheduler_running: true,
        interval_ms: 120000,
        max_accounts_per_tick: 3,
        max_messages_per_account: 4,
        last_started_at: "2026-07-11T10:00:00.000Z",
        last_tick_started_at: "2026-07-11T11:00:00.000Z",
        last_tick_finished_at: "2026-07-11T11:01:00.000Z",
        last_tick_status: "completed",
      }),
      gmailSchedulerAuditLogService: {
        recordGmailSchedulerOperatorAction,
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/integrations/gmail/scheduler/status",
      headers: authHeaders("owner"),
    });

    await app.close();

    const body = response.json();
    const serialized = JSON.stringify(body);

    expect(response.statusCode).toBe(200);
    expect(recordGmailSchedulerOperatorAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "gmail.scheduler.status_read",
        status: "running",
      }),
    );
    expect(body).toMatchObject({
      data: {
        scheduler_enabled: true,
        scheduler_running: true,
        interval_ms: 120000,
        max_accounts_per_tick: 3,
        max_messages_per_account: 4,
        last_tick_status: "completed",
      },
    });
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("raw Gmail");
    expect(serialized).not.toContain("provider_raw_error");
    expect(serialized).not.toContain("client_secret");
  });
});
