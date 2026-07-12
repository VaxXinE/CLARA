import { describe, expect, it, vi } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { AuditLogService } from "../src/audit/audit-log-service";
import { EmailOutboundDeliveryService } from "../src/channels/email/email-outbound-delivery-service";
import { FixtureEmailOutboundDeliveryRepository } from "../src/channels/email/email-outbound-delivery-repository";
import { GmailOutboundE2ESmokeService } from "../src/channels/email/gmail-outbound-e2e-smoke-service";
import type { GmailOutboundSendClient } from "../src/channels/email/gmail-outbound-send-client-types";
import { GmailOutboundSendService } from "../src/channels/email/gmail-outbound-send-service";
import { SimulatedGmailOutboundSendClient } from "../src/channels/email/simulated-gmail-outbound-send-client";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";
import { FixtureReplyRepository } from "../src/replies/reply-repository";
import { ReplyService } from "../src/replies/reply-service";
import { SimulatedReplySendProvider } from "../src/replies/simulated-reply-send-provider";

function auth() {
  return buildAuthContext({
    userId: "usr_demo_agent",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    role: "agent",
  });
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

function createSmoke(client: GmailOutboundSendClient) {
  const store = createFixtureAppStore();
  const gmailConversation = store.conversations.find(
    (conversation) => conversation.id === "conv_demo_sari_followup",
  );
  const gmailCustomer = store.customers.find(
    (customer) => customer.id === "cust_demo_sari",
  );

  if (!gmailConversation || !gmailCustomer) {
    throw new Error("Missing Gmail smoke fixture.");
  }

  gmailConversation.source = "email";
  gmailCustomer.source = "email";

  const replies = new ReplyService(
    new FixtureConversationRepository(store),
    new FixtureReplyRepository(store),
    new SimulatedReplySendProvider(),
    new AuditLogService(new FixtureAuditLogRepository(store)),
    {
      service: new GmailOutboundSendService(
        client,
        new EmailOutboundDeliveryService(
          new FixtureEmailOutboundDeliveryRepository(store),
        ),
      ),
      providerAccountId: "gmail_account_demo",
    },
  );

  return {
    store,
    smoke: new GmailOutboundE2ESmokeService(replies),
  };
}

describe("GmailOutboundE2ESmokeService", () => {
  it("runs a successful simulated Gmail reply send smoke safely", async () => {
    const { store, smoke } = createSmoke(
      new SimulatedGmailOutboundSendClient(),
    );
    const beforeMessageCount = store.messages.length;
    const beforeAiDraftCount = store.aiDraftEvents.length;
    const beforeInboundCount = store.emailInboundRecords.length;

    const result = await smoke.run({
      auth: auth(),
      conversationId: "conv_demo_sari_followup",
      body: "Internal Gmail outbound smoke reply.",
      correlationId: "corr_gmail_outbound_smoke",
    });

    expect(result).toMatchObject({
      status: "simulated",
      provider: "gmail",
      reply_id: expect.stringMatching(/^msg_/),
      outbound_delivery_id: expect.stringMatching(/^email_outbound_/),
      provider_message_id: expect.stringMatching(/^gmail_msg_/),
      reason_code: "simulated_send_completed",
      correlation_id: "corr_gmail_outbound_smoke",
    });
    expect(store.messages).toHaveLength(beforeMessageCount + 1);
    expect(store.emailOutboundDeliveries).toHaveLength(1);
    expect(store.aiDraftEvents).toHaveLength(beforeAiDraftCount);
    expect(store.emailInboundRecords).toHaveLength(beforeInboundCount);
    expectSafe(result);
    expectSafe(store.emailOutboundDeliveries[0]);
  });

  it("maps provider failure to a safe smoke result without raw provider details", async () => {
    const client: GmailOutboundSendClient = {
      send: vi.fn(async () => {
        throw new Error(
          "raw Gmail payload Authorization Bearer atk raw provider error body",
        );
      }),
    };
    const { store, smoke } = createSmoke(client);
    const beforeMessageCount = store.messages.length;
    const beforeAiDraftCount = store.aiDraftEvents.length;
    const beforeInboundCount = store.emailInboundRecords.length;

    const result = await smoke.run({
      auth: auth(),
      conversationId: "conv_demo_sari_followup",
      body: "Internal Gmail outbound smoke failure.",
      correlationId: "corr_gmail_outbound_failure",
    });

    expect(result).toEqual({
      status: "failed",
      provider: "gmail",
      outbound_delivery_id: expect.stringMatching(/^email_outbound_/),
      reason_code: "provider_send_failed",
      correlation_id: "corr_gmail_outbound_failure",
    });
    expect(store.messages).toHaveLength(beforeMessageCount);
    expect(store.emailOutboundDeliveries).toHaveLength(1);
    expect(store.emailOutboundDeliveries[0]).toMatchObject({
      status: "failed",
      failureCode: "provider_send_failed",
      providerMessageId: null,
    });
    expect(store.aiDraftEvents).toHaveLength(beforeAiDraftCount);
    expect(store.emailInboundRecords).toHaveLength(beforeInboundCount);
    expectSafe(result);
    expectSafe(store.emailOutboundDeliveries[0]);
  });
});
