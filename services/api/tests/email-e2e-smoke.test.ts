import { describe, expect, it } from "vitest";
import { AuthorizationError } from "../src/errors/app-error";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";
import type { EmailBatchLoadingAdapter } from "../src/channels/email/email-channel-adapter";
import { SimulatedEmailChannelAdapter } from "../src/channels/email/simulated-email-channel-adapter";
import { EmailInboundPersistenceService } from "../src/channels/email/email-inbound-persistence-service";
import { FixtureEmailInboundRepository } from "../src/channels/email/email-inbound-repository";
import { EmailReplyService } from "../src/channels/email/email-reply-service";
import { SimulatedEmailReplyAdapter } from "../src/channels/email/simulated-email-reply-adapter";
import { EmailOutboundDeliveryService } from "../src/channels/email/email-outbound-delivery-service";
import { FixtureEmailOutboundDeliveryRepository } from "../src/channels/email/email-outbound-delivery-repository";
import { EmailE2ESmokeService } from "../src/channels/email/email-e2e-smoke-service";
import type { SimulatedInboundEmailPayload } from "../src/channels/email/email-channel-types";

const demoScope = {
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
} as const;

function createHarness(messages: SimulatedInboundEmailPayload[] = []) {
  const store = createFixtureAppStore();
  const inboundRepository = new FixtureEmailInboundRepository(store);
  const outboundRepository = new FixtureEmailOutboundDeliveryRepository(store);
  const service = new EmailE2ESmokeService(
    new SimulatedEmailChannelAdapter(messages),
    new EmailInboundPersistenceService(inboundRepository),
    new EmailReplyService(new SimulatedEmailReplyAdapter()),
    new EmailOutboundDeliveryService(outboundRepository),
  );

  return {
    store,
    inboundRepository,
    outboundRepository,
    service,
  };
}

describe("email e2e smoke service", () => {
  it("runs the full internal inbound-to-outbound smoke flow offline", async () => {
    const { service, store } = createHarness([
      {
        providerMessageId: "email_smoke_inbound_001",
        threadId: "email_smoke_thread_001",
        fromEmail: "customer.smoke@example.test",
        fromName: "Smoke Customer",
        toEmail: "support@example.test",
        subject: "Need product help",
        textBody: "Hello support,\nI need help with my setup.",
        htmlBody: "<p>Hello support</p>",
        headers: {
          "message-id": "<email_smoke_inbound_001@example.test>",
          authorization: "Bearer should-not-pass",
        },
        attachments: [{ filename: "invoice.pdf" }],
        receivedAt: "2026-07-10T01:00:00.000Z",
      },
    ]);

    const result = await service.runSmoke({
      scope: demoScope,
      reply: {
        actorUserId: "usr_demo_agent",
        actorRole: "agent",
        textBody: "Halo, kami bantu cek dan tindak lanjuti ya.",
        idempotencyKey: "email_smoke_reply_001",
      },
    });

    expect(result).toMatchObject({
      scope: demoScope,
      attemptedCount: 1,
      persistedCount: 1,
      duplicateCount: 0,
      failedCount: 0,
      failures: [],
      reply: {
        actorUserId: "usr_demo_agent",
        actorRole: "agent",
      },
    });
    expect(result.reply.result.status).toBe("simulated");
    expect(result.reply.delivery.status).toBe("simulated");
    expect(result.reply.delivery.alreadyRecorded).toBe(false);
    expect(
      store.customers.some(
        (customer) => customer.id === result.reply.customerId,
      ),
    ).toBe(true);
    expect(
      store.conversations.some(
        (conversation) => conversation.id === result.reply.conversationId,
      ),
    ).toBe(true);
    expect(
      store.activityEvents.some(
        (event) =>
          event.conversationId === result.reply.conversationId &&
          event.eventType === "email_received",
      ),
    ).toBe(true);
    expect(store.emailOutboundDeliveries).toHaveLength(1);
    const serializedState = JSON.stringify(store);
    expect(serializedState).not.toContain("should-not-pass");
    expect(serializedState).not.toContain("Bearer ");
    expect(serializedState).not.toContain("raw_payload");
  });

  it("keeps inbound idempotency and still records one outbound delivery", async () => {
    const duplicateMessage = {
      providerMessageId: "email_smoke_dup_001",
      threadId: "email_smoke_dup_thread",
      fromEmail: "dup.smoke@example.test",
      fromName: "Duplicate Smoke",
      toEmail: "support@example.test",
      subject: "Duplicate smoke",
      textBody: "Persist once only.",
      receivedAt: "2026-07-10T02:00:00.000Z",
    };
    const { service, store } = createHarness([
      duplicateMessage,
      duplicateMessage,
    ]);

    const result = await service.runSmoke({
      scope: demoScope,
      reply: {
        actorUserId: "usr_demo_agent",
        actorRole: "owner",
        textBody: "Kami sudah menerima pesan Anda.",
        idempotencyKey: "email_smoke_reply_dup_001",
      },
    });

    expect(result.persistedCount).toBe(1);
    expect(result.duplicateCount).toBe(1);
    expect(store.emailInboundRecords).toHaveLength(1);
    expect(store.emailOutboundDeliveries).toHaveLength(1);
  });

  it("keeps workspace isolation for identical external email identities", async () => {
    const inbound = {
      providerMessageId: "email_smoke_scope_001",
      threadId: "email_smoke_scope_thread",
      fromEmail: "sari@example.test",
      fromName: "Scoped Customer",
      toEmail: "support@example.test",
      subject: "Scoped smoke",
      textBody: "This belongs to another workspace scope.",
      receivedAt: "2026-07-10T03:00:00.000Z",
    };
    const firstHarness = createHarness([inbound]);
    const secondHarness = createHarness([inbound]);

    const first = await firstHarness.service.runSmoke({
      scope: demoScope,
      reply: {
        actorUserId: "usr_demo_agent",
        actorRole: "agent",
        textBody: "Scoped reply one.",
      },
    });
    const second = await secondHarness.service.runSmoke({
      scope: {
        organizationId: "org_demo_other",
        workspaceId: "wks_demo_other",
      },
      reply: {
        actorUserId: "usr_demo_other_agent",
        actorRole: "agent",
        textBody: "Scoped reply two.",
      },
    });

    expect(first.reply.conversationId).not.toBe(second.reply.conversationId);
    expect(first.reply.customerId).not.toBe(second.reply.customerId);
    expect(firstHarness.store.emailOutboundDeliveries).toHaveLength(1);
    expect(secondHarness.store.emailOutboundDeliveries).toHaveLength(1);
  });

  it("blocks viewer role from sending the smoke reply", async () => {
    const { service } = createHarness([
      {
        providerMessageId: "email_smoke_viewer_001",
        threadId: "email_smoke_viewer_thread",
        fromEmail: "viewer-block@example.test",
        toEmail: "support@example.test",
        subject: "Viewer block",
        textBody: "Viewer should not send reply.",
        receivedAt: "2026-07-10T04:00:00.000Z",
      },
    ]);

    await expect(
      service.runSmoke({
        scope: demoScope,
        reply: {
          actorUserId: "usr_demo_viewer",
          actorRole: "viewer",
          textBody: "This must be blocked.",
        },
      }),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("does not require a real provider and never makes network calls", async () => {
    class CountingSimulatedAdapter
      extends SimulatedEmailChannelAdapter
      implements EmailBatchLoadingAdapter<SimulatedInboundEmailPayload>
    {
      loadCalls = 0;
      normalizeCalls = 0;

      override async loadInboundMessages(): Promise<
        SimulatedInboundEmailPayload[]
      > {
        this.loadCalls += 1;

        return super.loadInboundMessages();
      }

      override async normalizeInboundMessage(
        input: SimulatedInboundEmailPayload,
      ) {
        this.normalizeCalls += 1;

        return super.normalizeInboundMessage(input);
      }
    }

    const store = createFixtureAppStore();
    const adapter = new CountingSimulatedAdapter([
      {
        providerMessageId: "email_smoke_offline_001",
        threadId: "email_smoke_offline_thread",
        fromEmail: "offline@example.test",
        toEmail: "support@example.test",
        subject: "Offline smoke",
        textBody: "No external provider call should happen.",
        receivedAt: "2026-07-10T05:00:00.000Z",
      },
    ]);
    const service = new EmailE2ESmokeService(
      adapter,
      new EmailInboundPersistenceService(
        new FixtureEmailInboundRepository(store),
      ),
      new EmailReplyService(new SimulatedEmailReplyAdapter()),
      new EmailOutboundDeliveryService(
        new FixtureEmailOutboundDeliveryRepository(store),
      ),
    );

    const result = await service.runSmoke({
      scope: demoScope,
      reply: {
        actorUserId: "usr_demo_agent",
        actorRole: "agent",
        textBody: "Offline smoke reply.",
      },
    });

    expect(adapter.loadCalls).toBe(1);
    expect(adapter.normalizeCalls).toBe(1);
    expect(result.reply.result.metadata.provider).toBe("simulated-email");
  });
});
