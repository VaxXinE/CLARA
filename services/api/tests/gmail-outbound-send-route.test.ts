import { describe, expect, it, vi } from "vitest";
import type { GmailOutboundSendClient } from "../src/channels/email/gmail-outbound-send-client-types";
import { AuditLogService } from "../src/audit/audit-log-service";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { EmailOutboundDeliveryService } from "../src/channels/email/email-outbound-delivery-service";
import { FixtureEmailOutboundDeliveryRepository } from "../src/channels/email/email-outbound-delivery-repository";
import { GmailOutboundSendService } from "../src/channels/email/gmail-outbound-send-service";
import {
  GMAIL_OUTBOUND_MAX_BODY_LENGTH,
  GMAIL_OUTBOUND_MAX_RECIPIENTS,
  GMAIL_OUTBOUND_MAX_SUBJECT_LENGTH,
} from "../src/channels/email/gmail-outbound-send-service-types";
import { SimulatedGmailOutboundSendClient } from "../src/channels/email/simulated-gmail-outbound-send-client";
import { loadEnv } from "../src/config/env";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";
import { createServer } from "../src/http/server";

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

function validPayload() {
  return {
    provider_account_id: "gmail_account_demo",
    conversation_id: "conv_demo_budi_stock",
    to: ["customer@example.test"],
    cc: ["copy@example.test"],
    bcc: ["audit@example.test"],
    subject: "Follow up",
    body: "Hello, we are checking this and will reply shortly.",
    idempotency_key: "gmail_outbound_idem_001",
  };
}

function expectSafePayload(value: unknown): void {
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

describe("POST /api/v1/integrations/gmail/outbound/send", () => {
  it("requires auth and blocks viewer", async () => {
    const store = createFixtureAppStore();
    const service = new GmailOutboundSendService(
      new SimulatedGmailOutboundSendClient(),
      new EmailOutboundDeliveryService(
        new FixtureEmailOutboundDeliveryRepository(store),
      ),
    );
    const app = await createServer({
      env: testEnv,
      gmailOutboundSendService: service,
    });

    const unauthenticated = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/outbound/send",
      payload: validPayload(),
    });
    const viewer = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/outbound/send",
      headers: authHeaders("viewer"),
      payload: validPayload(),
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(viewer.statusCode).toBe(403);
    expect(store.emailOutboundDeliveries).toHaveLength(0);
  });

  it("allows an agent to explicitly send through simulated Gmail and persist a safe delivery", async () => {
    const store = createFixtureAppStore();
    const initialAiDraftCount = store.aiDraftEvents.length;
    const initialInboundRecordCount = store.emailInboundRecords.length;
    const initialOutboundMessageCount = store.messages.filter(
      (message) => message.direction === "outbound",
    ).length;
    const service = new GmailOutboundSendService(
      new SimulatedGmailOutboundSendClient(),
      new EmailOutboundDeliveryService(
        new FixtureEmailOutboundDeliveryRepository(store),
      ),
    );
    const app = await createServer({
      env: testEnv,
      gmailOutboundSendService: service,
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/outbound/send",
      headers: authHeaders("agent"),
      payload: validPayload(),
    });

    await app.close();

    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body).toMatchObject({
      status: "simulated",
      provider: "gmail",
      provider_message_id: expect.stringMatching(/^gmail_msg_/),
      outbound_delivery_id: expect.stringMatching(/^email_outbound_/),
      reason_code: "simulated_send_completed",
      sent_at: expect.any(String),
      correlation_id: expect.any(String),
    });
    expect(store.emailOutboundDeliveries).toHaveLength(1);
    expect(store.emailOutboundDeliveries[0]).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: "conv_demo_budi_stock",
      actorUserId: "usr_demo_agent",
      channel: "email",
      provider: "gmail",
      status: "simulated",
      idempotencyKey: "gmail_outbound_idem_001",
      metadata: {
        source: "gmail_outbound_send",
        transport: "simulated",
      },
    });
    expect(store.aiDraftEvents).toHaveLength(initialAiDraftCount);
    expect(store.emailInboundRecords).toHaveLength(initialInboundRecordCount);
    expect(
      store.messages.filter((message) => message.direction === "outbound"),
    ).toHaveLength(initialOutboundMessageCount);
    expectSafePayload(body);
    expectSafePayload(store.emailOutboundDeliveries[0]);
  });

  it("writes safe audit logs for Gmail outbound send request and result", async () => {
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
      payload: validPayload(),
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(store.auditLogs.slice(-2)).toMatchObject([
      {
        action: "gmail.outbound_send.requested",
        resourceType: "conversation",
        resourceId: "conv_demo_budi_stock",
        outcome: "success",
      },
      {
        action: "gmail.outbound_send.succeeded",
        resourceType: "conversation",
        resourceId: "conv_demo_budi_stock",
        outcome: "success",
      },
    ]);
    expect(store.auditLogs.at(-1)?.metadataJson).toMatchObject({
      provider: "gmail",
      conversation_id: "conv_demo_budi_stock",
      status: "simulated",
      reason_code: "simulated_send_completed",
      recipient_count: 3,
    });
    expectSafePayload(store.auditLogs.slice(-2));
  });

  it("returns scoped safe Gmail outbound delivery status", async () => {
    const store = createFixtureAppStore();
    const deliveries = new EmailOutboundDeliveryService(
      new FixtureEmailOutboundDeliveryRepository(store),
    );
    const delivery = await deliveries.recordGmailOutboundResult({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      conversationId: "conv_demo_budi_stock",
      actorUserId: "usr_demo_agent",
      providerMessageId: "gmail_msg_safe",
      status: "sent",
      sentAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    const app = await createServer({
      env: testEnv,
      gmailOutboundDeliveryService: deliveries,
    });

    const ok = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/outbound/deliveries/${delivery.id}`,
      headers: authHeaders("viewer"),
    });
    const unauthenticated = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/outbound/deliveries/${delivery.id}`,
    });
    const crossWorkspace = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/outbound/deliveries/${delivery.id}`,
      headers: {
        ...authHeaders("agent"),
        "x-mock-workspace-id": "wks_other",
      },
    });

    await app.close();

    expect(ok.statusCode).toBe(200);
    expect(ok.json()).toMatchObject({
      data: {
        outbound_delivery_id: delivery.id,
        provider: "gmail",
        status: "sent",
        provider_message_id: "gmail_msg_safe",
        conversation_id: "conv_demo_budi_stock",
        sent_at: "2026-01-01T00:00:00.000Z",
        created_at: expect.any(String),
        correlation_id: expect.any(String),
      },
    });
    expect(unauthenticated.statusCode).toBe(401);
    expect(crossWorkspace.statusCode).toBe(404);
    expectSafePayload(ok.json());
  });

  it("rejects spoofed scope and unknown unsafe body fields", async () => {
    const store = createFixtureAppStore();
    const app = await createServer({
      env: testEnv,
      gmailOutboundSendService: new GmailOutboundSendService(
        new SimulatedGmailOutboundSendClient(),
        new EmailOutboundDeliveryService(
          new FixtureEmailOutboundDeliveryRepository(store),
        ),
      ),
    });

    const spoofed = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/outbound/send",
      headers: authHeaders("owner"),
      payload: {
        ...validPayload(),
        organization_id: "org_other",
        workspace_id: "wks_other",
      },
    });
    const unknown = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/outbound/send",
      headers: authHeaders("owner"),
      payload: {
        ...validPayload(),
        raw_provider_payload: "raw Gmail payload",
      },
    });

    await app.close();

    expect(spoofed.statusCode).toBe(400);
    expect(unknown.statusCode).toBe(400);
    expect(store.emailOutboundDeliveries).toHaveLength(0);
  });

  it("validates recipients, subject length, body length, and total recipient count", async () => {
    const app = await createServer({
      env: testEnv,
      gmailOutboundSendService: new GmailOutboundSendService(
        new SimulatedGmailOutboundSendClient(),
      ),
    });

    const emptyRecipient = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/outbound/send",
      headers: authHeaders("agent"),
      payload: {
        ...validPayload(),
        to: [],
      },
    });
    const emptyBody = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/outbound/send",
      headers: authHeaders("agent"),
      payload: {
        ...validPayload(),
        body: "   ",
      },
    });
    const oversizedSubject = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/outbound/send",
      headers: authHeaders("agent"),
      payload: {
        ...validPayload(),
        subject: "s".repeat(GMAIL_OUTBOUND_MAX_SUBJECT_LENGTH + 1),
      },
    });
    const oversizedBody = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/outbound/send",
      headers: authHeaders("agent"),
      payload: {
        ...validPayload(),
        body: "b".repeat(GMAIL_OUTBOUND_MAX_BODY_LENGTH + 1),
      },
    });
    const tooManyRecipients = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/outbound/send",
      headers: authHeaders("agent"),
      payload: {
        ...validPayload(),
        to: Array.from(
          { length: GMAIL_OUTBOUND_MAX_RECIPIENTS },
          (_, index) => `customer${index}@example.test`,
        ),
        cc: ["copy@example.test"],
      },
    });

    await app.close();

    expect(emptyRecipient.statusCode).toBe(400);
    expect(emptyBody.statusCode).toBe(400);
    expect(oversizedSubject.statusCode).toBe(400);
    expect(oversizedBody.statusCode).toBe(400);
    expect(tooManyRecipients.statusCode).toBe(400);
  });

  it("persists provider failure as a safe failed delivery", async () => {
    const store = createFixtureAppStore();
    const client: GmailOutboundSendClient = {
      send: vi.fn(async () => {
        throw new Error(
          "raw Gmail payload Authorization Bearer atk raw provider error body",
        );
      }),
    };
    const app = await createServer({
      env: testEnv,
      gmailOutboundSendService: new GmailOutboundSendService(
        client,
        new EmailOutboundDeliveryService(
          new FixtureEmailOutboundDeliveryRepository(store),
        ),
      ),
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/outbound/send",
      headers: authHeaders("agent"),
      payload: validPayload(),
    });

    await app.close();

    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body).toMatchObject({
      status: "failed",
      provider: "gmail",
      outbound_delivery_id: expect.stringMatching(/^email_outbound_/),
      reason_code: "provider_send_failed",
      correlation_id: expect.any(String),
    });
    expect(store.emailOutboundDeliveries).toHaveLength(1);
    expect(store.emailOutboundDeliveries[0]).toMatchObject({
      status: "failed",
      failureCode: "provider_send_failed",
      providerMessageId: null,
      metadata: {
        source: "gmail_outbound_send",
      },
    });
    expectSafePayload(body);
    expectSafePayload(store.emailOutboundDeliveries[0]);
  });
});
