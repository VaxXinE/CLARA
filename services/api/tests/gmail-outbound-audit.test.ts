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

function authHeaders(role: "agent" | "viewer") {
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
  expect(serialized).not.toContain(["client", "secret"].join("_"));
  expect(serialized).not.toContain("raw Gmail payload");
  expect(serialized).not.toContain("raw provider error body");
  expect(serialized).not.toContain("email body");
  expect(serialized).not.toContain("unsafe full payload");
  expect(serialized).not.toContain("atk");
  expect(serialized).not.toContain("rtk");
}

function outboundPayload() {
  return {
    provider_account_id: "gmail_account_demo",
    conversation_id: "conv_demo_budi_stock",
    to: ["customer@example.test"],
    cc: ["copy@example.test"],
    subject: "Follow up",
    body: "email body must not be audited",
  };
}

function createReplyApp(client: GmailOutboundSendClient) {
  const store = createFixtureAppStore();
  const conversation = store.conversations.find(
    (item) => item.id === "conv_demo_sari_followup",
  );

  if (!conversation) {
    throw new Error("Missing Gmail conversation fixture.");
  }

  conversation.source = "gmail";
  const conversationRepository = new FixtureConversationRepository(store);
  const auditLogs = new AuditLogService(new FixtureAuditLogRepository(store));
  const deliveries = new EmailOutboundDeliveryService(
    new FixtureEmailOutboundDeliveryRepository(store),
  );
  const replies = new ReplyService(
    conversationRepository,
    new FixtureReplyRepository(store),
    new SimulatedReplySendProvider(),
    auditLogs,
    {
      service: new GmailOutboundSendService(client, deliveries),
      providerAccountId: "gmail_account_demo",
    },
  );

  return {
    store,
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

describe("Gmail outbound audit", () => {
  it("records safe Gmail outbound request and simulated result audit logs", async () => {
    const store = createFixtureAppStore();
    const auditLogs = new AuditLogService(new FixtureAuditLogRepository(store));
    const app = await createServer({
      env: testEnv,
      gmailOutboundSendService: new GmailOutboundSendService(
        new SimulatedGmailOutboundSendClient(),
        new EmailOutboundDeliveryService(
          new FixtureEmailOutboundDeliveryRepository(store),
        ),
        auditLogs,
      ),
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/outbound/send",
      headers: authHeaders("agent"),
      payload: outboundPayload(),
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(store.auditLogs.slice(-2)).toMatchObject([
      {
        action: "gmail.outbound_send.requested",
        resourceId: "conv_demo_budi_stock",
        outcome: "success",
      },
      {
        action: "gmail.outbound_send.succeeded",
        resourceId: "conv_demo_budi_stock",
        outcome: "success",
      },
    ]);
    expect(store.auditLogs.at(-1)?.metadataJson).toMatchObject({
      provider: "gmail",
      status: "simulated",
      reason_code: "simulated_send_completed",
      conversation_id: "conv_demo_budi_stock",
      outbound_delivery_id: expect.stringMatching(/^email_outbound_/),
      recipient_count: 2,
    });
    expectSafe(store.auditLogs.slice(-2));
  });

  it("records safe Gmail outbound failure audit log", async () => {
    const store = createFixtureAppStore();
    const auditLogs = new AuditLogService(new FixtureAuditLogRepository(store));
    const client: GmailOutboundSendClient = {
      send: vi.fn(async () => {
        throw new Error("raw Gmail payload Authorization Bearer atk");
      }),
    };
    const app = await createServer({
      env: testEnv,
      gmailOutboundSendService: new GmailOutboundSendService(
        client,
        new EmailOutboundDeliveryService(
          new FixtureEmailOutboundDeliveryRepository(store),
        ),
        auditLogs,
      ),
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/outbound/send",
      headers: authHeaders("agent"),
      payload: outboundPayload(),
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(store.auditLogs.at(-1)).toMatchObject({
      action: "gmail.outbound_send.failed",
      outcome: "failure",
    });
    expect(store.auditLogs.at(-1)?.metadataJson).toMatchObject({
      provider: "gmail",
      status: "failed",
      reason_code: "provider_send_failed",
      conversation_id: "conv_demo_budi_stock",
      outbound_delivery_id: expect.stringMatching(/^email_outbound_/),
      recipient_count: 2,
    });
    expectSafe(store.auditLogs.at(-1));
  });

  it("records safe Gmail reply request and simulated result audit logs", async () => {
    const { appPromise, store } = createReplyApp(
      new SimulatedGmailOutboundSendClient(),
    );
    const app = await appPromise;

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_sari_followup/reply",
      headers: authHeaders("agent"),
      payload: {
        body: "email body must not be audited",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(201);
    expect(store.auditLogs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          action: "gmail.reply_send.requested",
          resourceId: "conv_demo_sari_followup",
          outcome: "success",
        }),
        expect.objectContaining({
          action: "gmail.reply_send.succeeded",
          resourceId: "conv_demo_sari_followup",
          outcome: "success",
        }),
      ]),
    );
    expect(store.auditLogs.at(-1)?.metadataJson).toMatchObject({
      provider: "gmail",
      status: "simulated",
      reason_code: "simulated_send_completed",
      conversation_id: "conv_demo_sari_followup",
      outbound_delivery_id: expect.stringMatching(/^email_outbound_/),
      recipient_count: 1,
    });
    expectSafe(store.auditLogs);
  });

  it("records safe Gmail reply failure audit log", async () => {
    const { appPromise, store } = createReplyApp({
      send: vi.fn(async () => {
        throw new Error("raw provider error body Authorization Bearer atk");
      }),
    });
    const app = await appPromise;

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_sari_followup/reply",
      headers: authHeaders("agent"),
      payload: {
        body: "email body must not be audited",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(store.auditLogs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          action: "gmail.reply_send.requested",
          outcome: "success",
        }),
        expect.objectContaining({
          action: "gmail.reply_send.failed",
          outcome: "failure",
        }),
      ]),
    );
    expect(
      store.auditLogs.find((item) => item.action === "gmail.reply_send.failed")
        ?.metadataJson,
    ).toMatchObject({
      provider: "gmail",
      status: "failed",
      reason_code: "provider_send_failed",
      conversation_id: "conv_demo_sari_followup",
      outbound_delivery_id: expect.stringMatching(/^email_outbound_/),
      recipient_count: 1,
    });
    expectSafe(store.auditLogs);
  });
});
