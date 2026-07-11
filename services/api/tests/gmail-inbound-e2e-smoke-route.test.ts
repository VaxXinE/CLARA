import { describe, expect, it, vi } from "vitest";
import { loadEnv } from "../src/config/env";
import { NotFoundError } from "../src/errors/app-error";
import { createServer } from "../src/http/server";
import type { GmailInboundE2ESmokeService } from "../src/channels/email/gmail-inbound-e2e-smoke-service";

type SmokeRunner = Pick<GmailInboundE2ESmokeService, "runSmoke">;

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

describe("gmail inbound smoke route", () => {
  it("requires auth, blocks viewer, and runs the internal smoke for agent", async () => {
    const smokeService: SmokeRunner = {
      runSmoke: vi.fn(async () => ({
        status: "passed" as const,
        provider_account_id: "gmail_account_demo",
        fetched_count: 1,
        normalized_count: 1,
        persisted_count: 1,
        materialized_count: 1,
        skipped_count: 0,
        failed_count: 0,
        checked_at: "2026-07-11T10:00:00.000Z",
        reason_code: "ok" as const,
      })),
    };
    const app = await createServer({
      env: testEnv,
      gmailInboundE2ESmokeService: smokeService,
    });

    const unauthenticated = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_demo/inbound-smoke",
    });

    expect(unauthenticated.statusCode).toBe(401);

    const viewer = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_demo/inbound-smoke",
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
      url: "/api/v1/integrations/gmail/accounts/gmail_account_demo/inbound-smoke",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        max_messages: 5,
        page_token: "page_1",
        query: 'from:sales@example.test subject:"Invoice"',
        label_ids: ["INBOX", "UNREAD"],
      },
    });

    await app.close();

    expect(agent.statusCode).toBe(200);
    expect(agent.json()).toMatchObject({
      status: "passed",
      provider_account_id: "gmail_account_demo",
      materialized_count: 1,
    });
    expect(smokeService.runSmoke).toHaveBeenCalledWith({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      providerAccountId: "gmail_account_demo",
      maxMessages: 5,
      pageToken: "page_1",
      query: 'from:sales@example.test subject:"Invoice"',
      labelIds: ["INBOX", "UNREAD"],
    });
  });

  it("returns safe 404 for cross-workspace account access and validates input", async () => {
    const app = await createServer({
      env: testEnv,
      gmailInboundE2ESmokeService: {
        runSmoke: vi
          .fn()
          .mockRejectedValueOnce(
            new NotFoundError("Gmail provider account not found."),
          )
          .mockRejectedValueOnce(new Error("should not be called")),
      },
    });

    const crossWorkspace = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_demo/inbound-smoke",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_other",
        workspaceId: "wks_other",
        role: "agent",
      }),
    });

    const invalid = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/accounts/invalid id/inbound-smoke",
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

    expect(crossWorkspace.statusCode).toBe(404);
    expect(invalid.statusCode).toBe(400);
  });
});
