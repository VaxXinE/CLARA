import { describe, expect, it } from "vitest";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";
import {
  FixtureEmailOutboundDeliveryRepository,
  normalizeEmailOutboundDeliveryInput,
} from "../src/channels/email/email-outbound-delivery-repository";
import { EmailOutboundDeliveryService } from "../src/channels/email/email-outbound-delivery-service";

describe("email outbound delivery service", () => {
  it("records a simulated outbound email delivery with safe fields only", async () => {
    const store = createFixtureAppStore();
    const service = new EmailOutboundDeliveryService(
      new FixtureEmailOutboundDeliveryRepository(store),
    );

    const record = await service.recordReplyResult({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      replyId: "msg_demo_budi_2",
      actorUserId: "usr_demo_agent",
      idempotencyKey: "idem_delivery_demo_001",
      result: {
        status: "simulated",
        providerMessageId: "provider_msg_demo_001",
        providerThreadId: "provider_thread_demo_001",
        sentAt: new Date("2026-07-10T09:00:00.000Z"),
        metadata: {
          provider: "simulated-email",
          transport: "simulated",
        },
      },
    });

    expect(record).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      replyId: "msg_demo_budi_2",
      actorUserId: "usr_demo_agent",
      channel: "email",
      provider: "simulated-email",
      providerMessageId: "provider_msg_demo_001",
      providerThreadId: "provider_thread_demo_001",
      idempotencyKey: "idem_delivery_demo_001",
      status: "simulated",
      failureCode: null,
      alreadyRecorded: false,
      metadata: {
        source: "email_reply_adapter",
        transport: "simulated",
      },
    });
    expect(store.emailOutboundDeliveries).toHaveLength(1);
    expect(JSON.stringify(store.emailOutboundDeliveries[0])).not.toContain(
      "Hello Budi",
    );
  });

  it("records a failed outbound email delivery without raw provider payload", async () => {
    const store = createFixtureAppStore();
    const service = new EmailOutboundDeliveryService(
      new FixtureEmailOutboundDeliveryRepository(store),
    );

    const record = await service.recordReplyFailure({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      actorUserId: "usr_demo_agent",
      provider: "simulated-email",
      providerThreadId: "provider_thread_demo_002",
      failureCode: "EMAIL_PROVIDER_UNAVAILABLE",
    });

    expect(record.status).toBe("failed");
    expect(record.failureCode).toBe("EMAIL_PROVIDER_UNAVAILABLE");
    expect(record.metadata).toEqual({
      source: "email_reply_adapter",
    });
    expect(JSON.stringify(record)).not.toContain("raw_payload");
    expect(JSON.stringify(record)).not.toContain("token=");
  });

  it("returns the existing scoped record for duplicate idempotency keys", async () => {
    const store = createFixtureAppStore();
    const service = new EmailOutboundDeliveryService(
      new FixtureEmailOutboundDeliveryRepository(store),
    );
    const input = {
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      actorUserId: "usr_demo_agent",
      idempotencyKey: "idem_delivery_demo_dup",
      result: {
        status: "simulated" as const,
        providerMessageId: "provider_msg_demo_dup",
        providerThreadId: "provider_thread_demo_dup",
        sentAt: new Date("2026-07-10T09:05:00.000Z"),
        metadata: {
          provider: "simulated-email",
          transport: "simulated" as const,
        },
      },
    };

    const first = await service.recordReplyResult(input);
    const second = await service.recordReplyResult(input);

    expect(first.alreadyRecorded).toBe(false);
    expect(second.alreadyRecorded).toBe(true);
    expect(second.id).toBe(first.id);
    expect(store.emailOutboundDeliveries).toHaveLength(1);
  });

  it("keeps idempotency scoped per workspace", async () => {
    const store = createFixtureAppStore();
    const repository = new FixtureEmailOutboundDeliveryRepository(store);

    const first = await repository.recordDelivery({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      conversationId: "conv_demo_budi_stock",
      customerId: "cust_demo_budi",
      actorUserId: "usr_demo_agent",
      provider: "simulated-email",
      providerMessageId: "provider_msg_scoped_001",
      idempotencyKey: "idem_scoped_001",
      status: "simulated",
      sentAt: new Date("2026-07-10T09:10:00.000Z"),
      metadata: {
        source: "email_reply_adapter",
        transport: "simulated",
      },
    });
    const second = await repository.recordDelivery({
      scope: {
        organizationId: "org_demo_other",
        workspaceId: "wks_demo_other",
      },
      conversationId: "conv_other_workspace_secret",
      customerId: "cust_other_workspace",
      actorUserId: "usr_demo_other_agent",
      provider: "simulated-email",
      providerMessageId: "provider_msg_scoped_001",
      idempotencyKey: "idem_scoped_001",
      status: "simulated",
      sentAt: new Date("2026-07-10T09:11:00.000Z"),
      metadata: {
        source: "email_reply_adapter",
        transport: "simulated",
      },
    });

    expect(first.id).not.toBe(second.id);
    expect(store.emailOutboundDeliveries).toHaveLength(2);
  });

  it("strips non-allowlisted metadata values", () => {
    const normalized = normalizeEmailOutboundDeliveryInput({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      conversationId: "conv_demo_budi_stock",
      actorUserId: "usr_demo_agent",
      provider: "simulated-email",
      providerMessageId: "provider_msg_meta_001",
      status: "simulated",
      sentAt: new Date("2026-07-10T09:12:00.000Z"),
      metadata: {
        source: "email_reply_adapter",
        transport: "simulated",
        // @ts-expect-error testing runtime sanitization
        body: "sensitive body",
      },
    });

    expect(normalized.metadata).toEqual({
      source: "email_reply_adapter",
      transport: "simulated",
    });
  });
});
