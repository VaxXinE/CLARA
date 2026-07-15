import { describe, expect, it } from "vitest";
import { createServer } from "../src/http/server";
import { loadEnv } from "../src/config/env";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

function authHeaders(role: "owner" | "agent" | "viewer" = "agent") {
  return {
    "x-mock-user-id": `usr_demo_${role}`,
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": role,
  };
}

async function createReview(app: Awaited<ReturnType<typeof createServer>>) {
  return app.inject({
    method: "POST",
    url: "/api/v1/ai/draft-reviews",
    headers: authHeaders("agent"),
    payload: {
      conversationId: "conv_demo_budi_stock",
      suggestionId: "sug_test",
      draftText: "Thanks Budi, I will check stock availability.",
      safetyFlags: ["human_approval_required"],
    },
  });
}

describe("AI draft review API", () => {
  it("requires authentication", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/draft-reviews",
      payload: {
        conversationId: "conv_demo_budi_stock",
        draftText: "Draft",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(401);
  });

  it("creates, edits, approves, and reads an AI draft review without sending", async () => {
    const app = await createServer({ env: testEnv });

    const created = await createReview(app);
    expect(created.statusCode).toBe(201);

    const draftId = created.json().data.review.draftId as string;
    expect(created.json().data.review).toMatchObject({
      status: "suggested",
      requiresHumanApproval: true,
      safeReasonCode: "ai_human_approval_required",
    });

    const edited = await app.inject({
      method: "POST",
      url: `/api/v1/ai/draft-reviews/${draftId}/edit`,
      headers: authHeaders("agent"),
      payload: {
        draftText: "Thanks Budi, I checked and stock is available.",
      },
    });
    expect(edited.statusCode).toBe(200);
    expect(edited.json().data.review).toMatchObject({
      status: "editing",
      editedText: "Thanks Budi, I checked and stock is available.",
    });

    const approved = await app.inject({
      method: "POST",
      url: `/api/v1/ai/draft-reviews/${draftId}/approve`,
      headers: authHeaders("agent"),
      payload: {},
    });
    expect(approved.statusCode).toBe(200);
    expect(approved.json().data.review.status).toBe("approved");
    expect(JSON.stringify(approved.json())).not.toContain(
      "provider_message_id",
    );

    const read = await app.inject({
      method: "GET",
      url: `/api/v1/ai/draft-reviews/${draftId}`,
      headers: authHeaders("viewer"),
    });
    expect(read.statusCode).toBe(200);
    expect(read.json().data.review.status).toBe("approved");

    await app.close();
  });

  it("blocks viewer mutation and client supplied workspace authority", async () => {
    const app = await createServer({ env: testEnv });

    const viewer = await app.inject({
      method: "POST",
      url: "/api/v1/ai/draft-reviews",
      headers: authHeaders("viewer"),
      payload: {
        conversationId: "conv_demo_budi_stock",
        draftText: "Draft",
      },
    });
    expect(viewer.statusCode).toBe(403);

    const spoofed = await app.inject({
      method: "POST",
      url: "/api/v1/ai/draft-reviews",
      headers: authHeaders("agent"),
      payload: {
        conversationId: "conv_demo_budi_stock",
        workspaceId: "wks_other",
        draftText: "Draft",
      },
    });
    expect(spoofed.statusCode).toBe(400);
    expect(JSON.stringify(spoofed.json())).not.toContain("wks_other");

    await app.close();
  });

  it("rejects cross-workspace access and terminal-state approval", async () => {
    const app = await createServer({ env: testEnv });

    const created = await createReview(app);
    const draftId = created.json().data.review.draftId as string;

    const crossWorkspaceRead = await app.inject({
      method: "GET",
      url: `/api/v1/ai/draft-reviews/${draftId}`,
      headers: {
        ...authHeaders("agent"),
        "x-mock-workspace-id": "wks_demo_support",
      },
    });
    expect(crossWorkspaceRead.statusCode).toBe(404);

    const rejected = await app.inject({
      method: "POST",
      url: `/api/v1/ai/draft-reviews/${draftId}/reject`,
      headers: authHeaders("agent"),
      payload: {},
    });
    expect(rejected.statusCode).toBe(200);

    const approveRejected = await app.inject({
      method: "POST",
      url: `/api/v1/ai/draft-reviews/${draftId}/approve`,
      headers: authHeaders("agent"),
      payload: {},
    });
    expect(approveRejected.statusCode).toBe(409);

    await app.close();
  });
});
