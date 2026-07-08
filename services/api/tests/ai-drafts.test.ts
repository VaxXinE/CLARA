import { describe, expect, it } from "vitest";
import { FixtureActivityRepository } from "../src/activity/activity-repository";
import { ActivityQueryService } from "../src/activity/activity-service";
import { FixtureAiDraftRepository } from "../src/ai-drafts/ai-draft-repository";
import { AiDraftService } from "../src/ai-drafts/ai-draft-service";
import { MockAiDraftProvider } from "../src/ai-drafts/mock-ai-draft-provider";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";
import { loadEnv } from "../src/config/env";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { ConversationQueryService } from "../src/conversations/conversation-service";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { CustomerQueryService } from "../src/customers/customer-service";
import { createServer } from "../src/http/server";
import { FixtureReplyRepository } from "../src/replies/reply-repository";
import { ReplyService } from "../src/replies/reply-service";
import { SimulatedReplySendProvider } from "../src/replies/simulated-reply-send-provider";

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

function createTestServer() {
  const fixtureStore = createFixtureAppStore();
  const conversationRepository = new FixtureConversationRepository(
    fixtureStore,
  );
  const activityRepository = new FixtureActivityRepository(fixtureStore);
  const aiDraftRepository = new FixtureAiDraftRepository(fixtureStore);
  const replyRepository = new FixtureReplyRepository(fixtureStore);

  return {
    aiDraftRepository,
    appPromise: createServer({
      env: testEnv,
      services: {
        conversations: new ConversationQueryService(conversationRepository),
        customers: new CustomerQueryService(new FixtureCustomerRepository()),
        activity: new ActivityQueryService(
          activityRepository,
          conversationRepository,
        ),
        aiDrafts: new AiDraftService(
          conversationRepository,
          aiDraftRepository,
          new MockAiDraftProvider(),
        ),
        replies: new ReplyService(
          conversationRepository,
          replyRepository,
          new SimulatedReplySendProvider(),
        ),
      },
    }),
  };
}

describe("AI draft API", () => {
  it("requires authentication for AI draft generation", async () => {
    const { appPromise } = createTestServer();
    const app = await appPromise;

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/ai-draft",
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

  it("creates AI draft, AI event, and activity event for an agent", async () => {
    const { appPromise, aiDraftRepository } = createTestServer();
    const app = await appPromise;
    const beforeState = aiDraftRepository.getState();

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/ai-draft?organization_id=org_demo_other&workspace_id=wks_demo_other",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        tone: "friendly",
        instruction: "Keep it concise",
      },
    });

    expect(response.statusCode).toBe(201);

    const body = response.json();

    expect(body.data.draft).toMatchObject({
      conversation_id: "conv_demo_budi_stock",
      status: "draft",
      requires_human_review: true,
    });
    expect(body.data.draft.body).toContain("Hi Budi");
    expect(body.data.ai).toEqual({
      provider: "mock",
      model: "mock-clara-draft-v1",
    });
    expect(JSON.stringify(body)).not.toContain("prompt_version");
    expect(JSON.stringify(body)).not.toContain("raw provider");

    const afterState = aiDraftRepository.getState();

    expect(afterState.replyDrafts).toHaveLength(
      beforeState.replyDrafts.length + 1,
    );
    expect(afterState.aiDraftEvents).toHaveLength(
      beforeState.aiDraftEvents.length + 1,
    );
    expect(afterState.activityEvents).toHaveLength(
      beforeState.activityEvents.length + 1,
    );

    const createdDraft = afterState.replyDrafts.at(-1);
    const createdAiEvent = afterState.aiDraftEvents.at(-1);
    const createdActivityEvent = afterState.activityEvents.at(-1);

    expect(createdDraft).toMatchObject({
      id: body.data.draft.id,
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: "conv_demo_budi_stock",
      createdByUserId: "usr_demo_agent",
      source: "ai",
      status: "draft",
    });
    expect(createdAiEvent).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: "conv_demo_budi_stock",
      replyDraftId: body.data.draft.id,
      createdByUserId: "usr_demo_agent",
      promptVersion: "mvp_reply_draft_v1",
      provider: "mock",
      model: "mock-clara-draft-v1",
      status: "succeeded",
    });
    expect(createdActivityEvent).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: "conv_demo_budi_stock",
      actorUserId: "usr_demo_agent",
      eventType: "ai_draft_generated",
    });
    expect(JSON.stringify(createdActivityEvent?.metadata ?? {})).not.toContain(
      "api_key",
    );
    expect(JSON.stringify(createdActivityEvent?.metadata ?? {})).not.toContain(
      "hidden_prompt",
    );

    const activityResponse = await app.inject({
      method: "GET",
      url: "/api/v1/conversations/conv_demo_budi_stock/activity",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
    });

    expect(activityResponse.statusCode).toBe(200);
    expect(activityResponse.json().data.items[0].type).toBe(
      "ai_draft.generated",
    );
    expect(
      activityResponse
        .json()
        .data.items.some(
          (item: { type: string }) => item.type === "reply.sent",
        ),
    ).toBe(false);

    await app.close();
  });

  it("allows owner and agent to generate AI drafts", async () => {
    for (const role of ["owner", "agent"] as const) {
      const { appPromise } = createTestServer();
      const app = await appPromise;

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/conversations/conv_demo_sari_followup/ai-draft",
        headers: authHeaders({
          userId: role === "owner" ? "usr_demo_owner" : "usr_demo_agent",
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
          role,
        }),
      });

      await app.close();

      expect(response.statusCode).toBe(201);
      expect(response.json().data.draft.requires_human_review).toBe(true);
    }
  });

  it("forbids viewer from generating AI drafts", async () => {
    const { appPromise, aiDraftRepository } = createTestServer();
    const app = await appPromise;
    const beforeState = aiDraftRepository.getState();

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/ai-draft",
      headers: authHeaders({
        userId: "usr_demo_viewer",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "viewer",
      }),
    });

    await app.close();

    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({
      error: {
        code: "FORBIDDEN",
        message: "You do not have permission to perform this action.",
      },
    });

    const afterState = aiDraftRepository.getState();

    expect(afterState).toEqual(beforeState);
  });

  it("returns 404 for cross-workspace conversation AI draft generation", async () => {
    const { appPromise } = createTestServer();
    const app = await appPromise;

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_other_workspace_secret/ai-draft",
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

  it("returns safe validation error for invalid conversation id", async () => {
    const { appPromise } = createTestServer();
    const app = await appPromise;

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/invalid!id/ai-draft",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
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
