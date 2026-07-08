import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";

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

describe("activity APIs", () => {
  it("requires authentication for conversation activity", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/conversations/conv_demo_budi_stock/activity",
    });

    await app.close();

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      error: {
        code: "UNAUTHENTICATED",
        message: "Authentication is required.",
      },
    });
  });

  it("returns scoped activity timeline with a safe DTO", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/conversations/conv_demo_budi_stock/activity?organization_id=org_demo_other&workspace_id=wks_demo_other",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
    });

    await app.close();

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.data.conversation_id).toBe("conv_demo_budi_stock");
    expect(body.data.items).toHaveLength(2);
    expect(body.data.items[0]).toMatchObject({
      id: "act_demo_budi_ai_generated",
      type: "ai_draft.generated",
      title: "AI draft generated",
      description: "AI draft generated for Budi stock conversation.",
      actor: {
        type: "user",
        id: "usr_demo_agent",
        name: "Agent Demo",
      },
    });
    expect(body.data.items[1]).toMatchObject({
      id: "act_demo_budi_status_changed",
      type: "conversation.status_changed",
      title: "Conversation status changed",
      actor: {
        type: "system",
        id: null,
        name: "System",
      },
    });
    expect(body.data.items[0].created_at >= body.data.items[1].created_at).toBe(
      true,
    );
    expect(body.data.items[0].metadata).toBeUndefined();
    expect(JSON.stringify(body)).not.toContain("draft_id");
    expect(JSON.stringify(body)).not.toContain("prompt_version");
    expect(JSON.stringify(body)).not.toContain("provider");
    expect(JSON.stringify(body)).not.toContain("latency_ms");
  });

  it("allows owner, agent, and viewer to read conversation activity", async () => {
    for (const role of ["owner", "agent", "viewer"] as const) {
      const app = await createServer({ env: testEnv });

      const response = await app.inject({
        method: "GET",
        url: "/api/v1/conversations/conv_demo_sari_followup/activity",
        headers: authHeaders({
          userId:
            role === "owner"
              ? "usr_demo_owner"
              : role === "agent"
                ? "usr_demo_agent"
                : "usr_demo_viewer",
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
          role,
        }),
      });

      await app.close();

      expect(response.statusCode).toBe(200);
      expect(response.json().data.items).toHaveLength(1);
    }
  });

  it("returns 404 for cross-workspace conversation activity access", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/conversations/conv_other_workspace_secret/activity",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
    });

    await app.close();

    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      error: {
        code: "NOT_FOUND",
        message: "Conversation not found.",
      },
    });
  });

  it("returns 404 when a valid conversation id has no scoped resource", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/conversations/conv_missing_01/activity",
      headers: authHeaders({
        userId: "usr_demo_owner",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "owner",
      }),
    });

    await app.close();

    expect(response.statusCode).toBe(404);
  });

  it("returns safe validation error for invalid conversation id", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/conversations/invalid!id/activity",
      headers: authHeaders({
        userId: "usr_demo_viewer",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "viewer",
      }),
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request.",
      },
    });
  });
});
