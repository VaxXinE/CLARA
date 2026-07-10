import { describe, expect, it, vi } from "vitest";
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
        skipped_count: 0,
        failed_count: 0,
        next_page_token: "page_2",
        reason_code: "sync_completed" as const,
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
    });
    expect(syncService.syncMessages).toHaveBeenCalledWith({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      maxMessages: 999,
      pageToken: "page_1",
      persistNormalized: true,
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
});
