import { describe, expect, it } from "vitest";
import { FixtureActivityRepository } from "../src/activity/activity-repository";
import { ActivityQueryService } from "../src/activity/activity-service";
import { FixtureAiDraftRepository } from "../src/ai-drafts/ai-draft-repository";
import { AiDraftService } from "../src/ai-drafts/ai-draft-service";
import { MockAiDraftProvider } from "../src/ai-drafts/mock-ai-draft-provider";
import { loadEnv } from "../src/config/env";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { ConversationQueryService } from "../src/conversations/conversation-service";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { CustomerQueryService } from "../src/customers/customer-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";
import { createServer } from "../src/http/server";
import { FixtureReplyRepository } from "../src/replies/reply-repository";
import { ReplyService } from "../src/replies/reply-service";
import type {
  ReplySendProvider,
  SendReplyProviderInput,
  SendReplyProviderResult,
} from "../src/replies/reply-send-provider";
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
  return createTestServerWithProvider(new SimulatedReplySendProvider());
}

function createTestServerWithProvider(provider: ReplySendProvider) {
  const fixtureStore = createFixtureAppStore();
  const conversationRepository = new FixtureConversationRepository(
    fixtureStore,
  );
  const activityRepository = new FixtureActivityRepository(fixtureStore);
  const aiDraftRepository = new FixtureAiDraftRepository(fixtureStore);
  const replyRepository = new FixtureReplyRepository(fixtureStore);

  return {
    aiDraftRepository,
    replyRepository,
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
          provider,
        ),
      },
    }),
  };
}

class FailingReplySendProvider implements ReplySendProvider {
  async sendReply(
    _input: SendReplyProviderInput,
  ): Promise<SendReplyProviderResult> {
    throw new Error("simulated upstream send failure secret=demo-send-secret");
  }
}

describe("reply send API", () => {
  it("requires authentication for reply send", async () => {
    const { appPromise } = createTestServer();
    const app = await appPromise;

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/reply",
      payload: {
        body: "Halo Budi, kami bantu cek ya.",
      },
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

  it("sends a reply for an agent, updates draft status, conversation timestamps, and activity", async () => {
    const { appPromise, replyRepository } = createTestServer();
    const app = await appPromise;
    const beforeState = replyRepository.getState();

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/reply?organization_id=org_demo_other&workspace_id=wks_demo_other",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        body: "  Hi Budi, thanks for reaching out. We will help you shortly.  ",
        draft_id: "draft_demo_budi_ai",
      },
    });

    expect(response.statusCode).toBe(201);

    const body = response.json();

    expect(body.data.message).toMatchObject({
      conversation_id: "conv_demo_budi_stock",
      direction: "outbound",
      body: "Hi Budi, thanks for reaching out. We will help you shortly.",
      sender: {
        type: "user",
        id: "usr_demo_agent",
        name: "Agent Demo",
      },
    });
    expect(body.data.send).toEqual({
      provider: "simulated",
      status: "sent",
    });

    const afterState = replyRepository.getState();

    expect(afterState.messages).toHaveLength(beforeState.messages.length + 1);
    expect(afterState.activityEvents).toHaveLength(
      beforeState.activityEvents.length + 1,
    );

    const lastMessage = afterState.messages.at(-1);
    const updatedDraft = afterState.replyDrafts.find(
      (draft) => draft.id === "draft_demo_budi_ai",
    );
    const updatedConversation = afterState.conversations.find(
      (conversation) => conversation.id === "conv_demo_budi_stock",
    );
    const lastActivity = afterState.activityEvents.at(-1);

    expect(lastMessage).toMatchObject({
      id: body.data.message.id,
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: "conv_demo_budi_stock",
      direction: "outbound",
      senderType: "agent",
      senderUserId: "usr_demo_agent",
      body: "Hi Budi, thanks for reaching out. We will help you shortly.",
      deliveryStatus: "simulated",
    });
    expect(updatedDraft?.status).toBe("sent");
    expect(updatedConversation?.lastMessageAt?.toISOString()).toBe(
      body.data.message.created_at,
    );
    expect(updatedConversation?.updatedAt?.toISOString()).toBe(
      body.data.message.created_at,
    );
    expect(lastActivity).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: "conv_demo_budi_stock",
      actorUserId: "usr_demo_agent",
      eventType: "reply_sent",
    });

    const detailResponse = await app.inject({
      method: "GET",
      url: "/api/v1/conversations/conv_demo_budi_stock",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
    });

    expect(detailResponse.statusCode).toBe(200);
    expect(detailResponse.json().conversation.messages.at(-1)).toMatchObject({
      id: body.data.message.id,
      direction: "outbound",
      body: "Hi Budi, thanks for reaching out. We will help you shortly.",
    });

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
    expect(activityResponse.json().data.items[0].type).toBe("reply.sent");

    await app.close();
  });

  it("allows owner and agent to send replies", async () => {
    for (const role of ["owner", "agent"] as const) {
      const { appPromise } = createTestServer();
      const app = await appPromise;

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/conversations/conv_demo_sari_followup/reply",
        headers: authHeaders({
          userId: role === "owner" ? "usr_demo_owner" : "usr_demo_agent",
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
          role,
        }),
        payload: {
          body: "Baik, kami bantu tindak lanjuti sekarang.",
        },
      });

      await app.close();

      expect(response.statusCode).toBe(201);
    }
  });

  it("forbids viewer from sending replies", async () => {
    const { appPromise, replyRepository } = createTestServer();
    const app = await appPromise;
    const beforeState = replyRepository.getState();

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/reply",
      headers: authHeaders({
        userId: "usr_demo_viewer",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "viewer",
      }),
      payload: {
        body: "Saya akan balas ini.",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({
      error: {
        code: "FORBIDDEN",
        message: "You do not have permission to perform this action.",
      },
    });
    expect(replyRepository.getState()).toEqual(beforeState);
  });

  it("returns safe validation error for empty or oversized reply body", async () => {
    const { appPromise } = createTestServer();
    const app = await appPromise;

    const emptyResponse = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/reply",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        body: "   ",
      },
    });

    const oversizedResponse = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/reply",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        body: "a".repeat(2001),
      },
    });

    await app.close();

    expect(emptyResponse.statusCode).toBe(400);
    expect(emptyResponse.json()).toMatchObject({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request.",
      },
    });
    expect(oversizedResponse.statusCode).toBe(400);
    expect(oversizedResponse.json()).toMatchObject({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request.",
      },
    });
  });

  it("returns 404 for cross-workspace conversation or draft access", async () => {
    const { appPromise } = createTestServer();
    const app = await appPromise;

    const crossConversationResponse = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_other_workspace_secret/reply",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        body: "This should not work.",
      },
    });

    const wrongDraftResponse = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_sari_followup/reply",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        body: "Trying to use another conversation draft.",
        draft_id: "draft_demo_budi_ai",
      },
    });

    await app.close();

    expect(crossConversationResponse.statusCode).toBe(404);
    expect(crossConversationResponse.json()).toMatchObject({
      error: {
        code: "NOT_FOUND",
        message: "Conversation not found.",
      },
    });
    expect(wrongDraftResponse.statusCode).toBe(404);
    expect(wrongDraftResponse.json()).toMatchObject({
      error: {
        code: "NOT_FOUND",
        message: "Reply draft not found.",
      },
    });
  });

  it("requires explicit human send and AI draft endpoint does not create outbound messages", async () => {
    const { appPromise, replyRepository } = createTestServer();
    const app = await appPromise;
    const initialState = replyRepository.getState();

    const aiDraftResponse = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/ai-draft",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        tone: "friendly",
      },
    });

    expect(aiDraftResponse.statusCode).toBe(201);
    expect(replyRepository.getState().messages).toHaveLength(
      initialState.messages.length,
    );

    const sendResponse = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/reply",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        body: "Human-reviewed reply goes out only now.",
      },
    });

    await app.close();

    expect(sendResponse.statusCode).toBe(201);
    expect(replyRepository.getState().messages).toHaveLength(
      initialState.messages.length + 1,
    );
  });

  it("returns safe validation error for invalid conversation id", async () => {
    const { appPromise } = createTestServer();
    const app = await appPromise;

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/invalid!id/reply",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        body: "Hello.",
      },
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

  it("returns a safe 502 envelope when the send provider fails", async () => {
    const { appPromise, replyRepository } = createTestServerWithProvider(
      new FailingReplySendProvider(),
    );
    const app = await appPromise;
    const beforeState = replyRepository.getState();

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/reply?organization_id=org_demo_other",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        body: "Manual send must fail safely.",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(502);
    expect(response.json()).toMatchObject({
      error: {
        code: "SEND_FAILED",
        message: "Unable to send reply right now.",
      },
    });
    expect(response.json().error.correlation_id).toEqual(expect.any(String));
    expect(response.body).not.toContain("simulated upstream send failure");
    expect(response.body).not.toContain("demo-send-secret");
    expect(response.body).not.toContain("stack");
    expect(replyRepository.getState()).toEqual(beforeState);
  });
});
