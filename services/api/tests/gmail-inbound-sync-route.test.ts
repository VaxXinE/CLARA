import { describe, expect, it, vi } from "vitest";
import { ConflictError, NotFoundError } from "../src/errors/app-error";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import type { GmailInboundSyncService } from "../src/channels/email/gmail-inbound-sync-service";

type SyncRunner = Pick<GmailInboundSyncService, "syncMessages">;

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

function authHeaders(input: {
  userId: string;
  organizationId: string;
  workspaceId: string;
  role: "owner" | "agent" | "viewer";
}) {
  return {
    "x-mock-user-id": input.userId,
    "x-mock-organization-id": input.organizationId,
    "x-mock-workspace-id": input.workspaceId,
    "x-mock-role": input.role,
  };
}

describe("gmail inbound sync route", () => {
  it("requires auth, blocks viewer, and runs bounded sync for agent", async () => {
    const syncService: SyncRunner = {
      syncMessages: vi.fn(async () => ({
        provider_account_id: "gmail_account_demo",
        provider: "gmail" as const,
        status: "completed" as const,
        fetched_count: 2,
        normalized_count: 0,
        persisted_count: 0,
        materialized_count: 0,
        skipped_count: 0,
        failed_count: 0,
        next_page_token: "page_2",
        last_history_id: "h123",
        reason_code: "sync_completed" as const,
        sync_state: {
          status: "completed" as const,
          last_started_at: "2026-07-10T11:59:00.000Z",
          last_completed_at: "2026-07-10T12:00:00.000Z",
          last_failed_at: null,
          last_failure_reason_code: null,
        },
        synced_at: "2026-07-10T12:00:00.000Z",
      })),
    };
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncService: syncService,
    });

    const unauthenticated = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_demo/sync",
    });

    expect(unauthenticated.statusCode).toBe(401);

    const viewer = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_demo/sync",
      headers: authHeaders({
        userId: "usr_demo_viewer",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "viewer",
      }),
    });

    expect(viewer.statusCode).toBe(403);

    const agent = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_demo/sync",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        max_messages: 999,
        page_token: "page_1",
        persist_normalized: true,
        materialize_conversation: true,
        query: 'from:sales@example.test subject:"Invoice"',
        label_ids: ["INBOX", "UNREAD"],
      },
    });

    await app.close();

    expect(agent.statusCode).toBe(200);
    expect(agent.json()).toMatchObject({
      provider_account_id: "gmail_account_demo",
      provider: "gmail",
      status: "completed",
      fetched_count: 2,
      normalized_count: 0,
      persisted_count: 0,
      materialized_count: 0,
      last_history_id: "h123",
      sync_state: {
        status: "completed",
      },
    });
    expect(syncService.syncMessages).toHaveBeenCalledWith({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      maxMessages: 999,
      pageToken: "page_1",
      persistNormalized: true,
      materializeConversation: true,
      query: 'from:sales@example.test subject:"Invoice"',
      labelIds: ["INBOX", "UNREAD"],
    });
  });

  it("validates route input safely", async () => {
    const syncService: SyncRunner = {
      syncMessages: vi.fn(),
    };
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncService: syncService,
    });

    const invalid = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/accounts/invalid id/sync",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        max_messages: 0,
      },
    });

    await app.close();

    expect(invalid.statusCode).toBe(400);
  });

  it("rejects unsafe page tokens and body scope spoofing safely", async () => {
    const syncService: SyncRunner = {
      syncMessages: vi.fn(),
    };
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncService: syncService,
    });

    const unsafeToken = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_demo/sync",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        page_token: "bad token\nvalue",
      },
    });

    const spoofedScope = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_demo/sync",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        organization_id: "org_other",
        workspace_id: "wks_other",
      },
    });

    await app.close();

    expect(unsafeToken.statusCode).toBe(400);
    expect(spoofedScope.statusCode).toBe(400);
    expect(syncService.syncMessages).not.toHaveBeenCalled();
  });

  it("returns safe 409 for already-running sync and safe 404 for cross-workspace account access", async () => {
    const syncService: SyncRunner = {
      syncMessages: vi
        .fn()
        .mockRejectedValueOnce(
          new ConflictError("Gmail inbound sync is already running."),
        )
        .mockRejectedValueOnce(
          new NotFoundError("Gmail provider account not found."),
        ),
    };
    const app = await createServer({
      env: testEnv,
      gmailInboundSyncService: syncService,
    });

    const conflict = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_demo/sync",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        max_messages: 5,
      },
    });

    const notFound = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_other/sync",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
    });

    await app.close();

    expect(conflict.statusCode).toBe(409);
    expect(conflict.json()).toMatchObject({
      error: {
        message: "Gmail inbound sync is already running.",
      },
    });
    expect(notFound.statusCode).toBe(404);
  });
});
