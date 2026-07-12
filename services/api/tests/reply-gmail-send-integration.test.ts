import { describe, expect, it, vi } from "vitest";
import { FixtureActivityRepository } from "../src/activity/activity-repository";
import { ActivityQueryService } from "../src/activity/activity-service";
import { FixtureAiDraftRepository } from "../src/ai-drafts/ai-draft-repository";
import { AiDraftService } from "../src/ai-drafts/ai-draft-service";
import { MockAiDraftProvider } from "../src/ai-drafts/mock-ai-draft-provider";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { AuditLogService } from "../src/audit/audit-log-service";
import { EmailOutboundDeliveryService } from "../src/channels/email/email-outbound-delivery-service";
import { FixtureEmailOutboundDeliveryRepository } from "../src/channels/email/email-outbound-delivery-repository";
import type { GmailOutboundSendClient } from "../src/channels/email/gmail-outbound-send-client-types";
import { GmailOutboundSendService } from "../src/channels/email/gmail-outbound-send-service";
import { SimulatedGmailOutboundSendClient } from "../src/channels/email/simulated-gmail-outbound-send-client";
import { loadEnv } from "../src/config/env";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { ConversationQueryService } from "../src/conversations/conversation-service";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { CustomerQueryService } from "../src/customers/customer-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";
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

function authHeaders(role: "owner" | "agent" | "viewer") {
  return {
    "x-mock-user-id": `usr_demo_${role}`,
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": role,
  };
}

function expectSafe(value: unknown): void {
  const serialized = JSON.stringify(value);

  expect(serialized).not.toContain("access_token");
  expect(serialized).not.toContain("refresh_token");
  expect(serialized).not.toContain("Authorization");
  expect(serialized).not.toContain("raw Gmail payload");
  expect(serialized).not.toContain("raw provider error body");
  expect(serialized).not.toContain(["client", "secret"].join("_"));
  expect(serialized).not.toContain("atk");
  expect(serialized).not.toContain("rtk");
}

function createGmailReplyHarness(client: GmailOutboundSendClient) {
  const store = createFixtureAppStore();
  const gmailConversation = store.conversations.find(
    (conversation) => conversation.id === "conv_demo_sari_followup",
  );
  const gmailCustomer = store.customers.find(
    (customer) => customer.id === "cust_demo_sari",
  );

  if (!gmailConversation || !gmailCustomer) {
    throw new Error("Missing Gmail reply fixture.");
  }

  gmailConversation.source = "email";
  gmailCustomer.source = "email";

  const conversationRepository = new FixtureConversationRepository(store);
  const replyRepository = new FixtureReplyRepository(store);
  const auditLogs = new AuditLogService(new FixtureAuditLogRepository(store));
  const deliveries = new EmailOutboundDeliveryService(
    new FixtureEmailOutboundDeliveryRepository(store),
  );
  const gmailOutbound = new GmailOutboundSendService(client, deliveries);
  const replies = new ReplyService(
    conversationRepository,
    replyRepository,
    new SimulatedReplySendProvider(),
    auditLogs,
    {
      service: gmailOutbound,
      providerAccountId: "gmail_account_demo",
    },
  );

  return {
    store,
    replyRepository,
    replies,
    appPromise: createServer({
      env: testEnv,
      services: {
        conversations: new ConversationQueryService(conversationRepository),
        customers: new CustomerQueryService(
          new FixtureCustomerRepository(store),
        ),
        activity: new ActivityQueryService(
          new FixtureActivityRepository(store),
          conversationRepository,
        ),
        aiDrafts: new AiDraftService(
          conversationRepository,
          new FixtureAiDraftRepository(store),
          new MockAiDraftProvider(),
          auditLogs,
        ),
        replies,
      },
    }),
  };
}

describe("Gmail reply send integration", () => {
  it("sends an email conversation reply through simulated Gmail and persists safe delivery", async () => {
    const { appPromise, store, replyRepository } = createGmailReplyHarness(
      new SimulatedGmailOutboundSendClient(),
    );
    const app = await appPromise;
    const beforeState = replyRepository.getState();
    const beforeInboundCount = store.emailInboundRecords.length;
    const beforeAiDraftCount = store.aiDraftEvents.length;

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_sari_followup/reply",
      headers: authHeaders("agent"),
      payload: {
        body: "Human reviewed Gmail reply.",
      },
    });

    await app.close();

    const body = response.json();

    expect(response.statusCode).toBe(201);
    expect(body.data.message).toMatchObject({
      conversation_id: "conv_demo_sari_followup",
      direction: "outbound",
      body: "Human reviewed Gmail reply.",
    });
    expect(body.data.send).toMatchObject({
      provider: "gmail",
      status: "simulated",
      provider_message_id: expect.stringMatching(/^gmail_msg_/),
      outbound_delivery_id: expect.stringMatching(/^email_outbound_/),
      reason_code: "simulated_send_completed",
      correlation_id: expect.any(String),
    });
    expect(store.emailOutboundDeliveries).toHaveLength(1);
    expect(store.emailOutboundDeliveries[0]).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: "conv_demo_sari_followup",
      actorUserId: "usr_demo_agent",
      provider: "gmail",
      status: "simulated",
      metadata: {
        source: "gmail_outbound_send",
        transport: "simulated",
      },
    });
    expect(replyRepository.getState().messages).toHaveLength(
      beforeState.messages.length + 1,
    );
    expect(store.emailInboundRecords).toHaveLength(beforeInboundCount);
    expect(store.aiDraftEvents).toHaveLength(beforeAiDraftCount);
    expect(store.auditLogs.slice(-2)).toMatchObject([
      {
        action: "reply.sent",
        outcome: "success",
      },
      {
        action: "gmail.reply_send.succeeded",
        resourceId: "conv_demo_sari_followup",
        outcome: "success",
      },
    ]);
    expect(store.auditLogs.at(-1)?.metadataJson).toMatchObject({
      provider: "gmail",
      conversation_id: "conv_demo_sari_followup",
      status: "simulated",
      reason_code: "simulated_send_completed",
      recipient_count: 1,
    });
    expectSafe(body);
    expectSafe(store.emailOutboundDeliveries[0]);
    expectSafe(store.auditLogs.slice(-2));
  });

  it("preserves the non-Gmail reply path", async () => {
    const { appPromise, store } = createGmailReplyHarness(
      new SimulatedGmailOutboundSendClient(),
    );
    const app = await appPromise;

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/reply",
      headers: authHeaders("owner"),
      payload: {
        body: "Non Gmail reply still uses existing provider.",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(201);
    expect(response.json().data.send).toEqual({
      provider: "simulated",
      status: "sent",
    });
    expect(store.emailOutboundDeliveries).toHaveLength(0);
  });

  it("keeps auth, viewer, and scope spoofing guardrails on the reply route", async () => {
    const { appPromise, store } = createGmailReplyHarness(
      new SimulatedGmailOutboundSendClient(),
    );
    const app = await appPromise;

    const unauthenticated = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_sari_followup/reply",
      payload: {
        body: "No auth.",
      },
    });
    const viewer = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_sari_followup/reply",
      headers: authHeaders("viewer"),
      payload: {
        body: "Viewer cannot send.",
      },
    });
    const spoofed = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_sari_followup/reply",
      headers: authHeaders("agent"),
      payload: {
        body: "Spoof scope.",
        organization_id: "org_other",
        workspace_id: "wks_other",
      },
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(viewer.statusCode).toBe(403);
    expect(spoofed.statusCode).toBe(400);
    expect(store.emailOutboundDeliveries).toHaveLength(0);
  });

  it("maps Gmail provider failure to a safe result and failed delivery without creating a reply message", async () => {
    const client: GmailOutboundSendClient = {
      send: vi.fn(async () => {
        throw new Error(
          "raw Gmail payload Authorization Bearer atk raw provider error body",
        );
      }),
    };
    const { appPromise, store, replyRepository } =
      createGmailReplyHarness(client);
    const app = await appPromise;
    const beforeState = replyRepository.getState();

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_sari_followup/reply",
      headers: authHeaders("agent"),
      payload: {
        body: "This provider failure must be safe.",
      },
    });

    await app.close();

    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body).toEqual({
      data: {
        send: {
          provider: "gmail",
          status: "failed",
          outbound_delivery_id: expect.stringMatching(/^email_outbound_/),
          reason_code: "provider_send_failed",
          correlation_id: expect.any(String),
        },
      },
    });
    expect(replyRepository.getState().messages).toEqual(beforeState.messages);
    expect(store.emailOutboundDeliveries).toHaveLength(1);
    expect(store.emailOutboundDeliveries[0]).toMatchObject({
      status: "failed",
      failureCode: "provider_send_failed",
      providerMessageId: null,
      metadata: {
        source: "gmail_outbound_send",
      },
    });
    expect(store.auditLogs.slice(-2)).toMatchObject([
      {
        action: "gmail.reply_send.failed",
        outcome: "failure",
      },
      {
        action: "reply.failed",
        outcome: "failure",
      },
    ]);
    expect(store.auditLogs.at(-2)?.metadataJson).toMatchObject({
      provider: "gmail",
      conversation_id: "conv_demo_sari_followup",
      status: "failed",
      reason_code: "provider_send_failed",
      recipient_count: 1,
    });
    expectSafe(body);
    expectSafe(store.emailOutboundDeliveries[0]);
    expectSafe(store.auditLogs.slice(-2));
  });
});
