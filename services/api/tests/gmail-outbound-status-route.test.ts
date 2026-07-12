import { describe, expect, it } from "vitest";
import { EmailOutboundDeliveryService } from "../src/channels/email/email-outbound-delivery-service";
import { FixtureEmailOutboundDeliveryRepository } from "../src/channels/email/email-outbound-delivery-repository";
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

function authHeaders(input: {
  role: "owner" | "agent" | "viewer";
  workspaceId?: string;
}) {
  return {
    "x-mock-user-id": `usr_demo_${input.role}`,
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": input.workspaceId ?? "wks_demo_sales",
    "x-mock-role": input.role,
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
}

describe("GET /api/v1/integrations/gmail/outbound/deliveries/:deliveryId", () => {
  it("requires authentication and allows viewer read-only access to owned status", async () => {
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

    const unauthenticated = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/outbound/deliveries/${delivery.id}`,
    });
    const viewer = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/outbound/deliveries/${delivery.id}`,
      headers: authHeaders({ role: "viewer" }),
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(viewer.statusCode).toBe(200);
    expect(viewer.json()).toMatchObject({
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
    expectSafe(viewer.json());
  });

  it("derives workspace from AuthContext and returns safe 404 for cross-workspace access", async () => {
    const store = createFixtureAppStore();
    const deliveries = new EmailOutboundDeliveryService(
      new FixtureEmailOutboundDeliveryRepository(store),
    );
    const delivery = await deliveries.recordGmailOutboundFailure({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      conversationId: "conv_demo_budi_stock",
      actorUserId: "usr_demo_agent",
      failureCode: "provider_send_failed",
    });
    const app = await createServer({
      env: testEnv,
      gmailOutboundDeliveryService: deliveries,
    });

    const spoofQuery = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/outbound/deliveries/${delivery.id}?organization_id=org_other&workspace_id=wks_other`,
      headers: authHeaders({ role: "agent" }),
    });
    const crossWorkspace = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/outbound/deliveries/${delivery.id}`,
      headers: authHeaders({ role: "agent", workspaceId: "wks_other" }),
    });

    await app.close();

    expect(spoofQuery.statusCode).toBe(200);
    expect(spoofQuery.json()).toMatchObject({
      data: {
        outbound_delivery_id: delivery.id,
        provider: "gmail",
        status: "failed",
        reason_code: "provider_send_failed",
        conversation_id: "conv_demo_budi_stock",
        failed_at: expect.any(String),
        created_at: expect.any(String),
      },
    });
    expect(crossWorkspace.statusCode).toBe(404);
    expect(crossWorkspace.json()).toMatchObject({
      error: {
        code: "NOT_FOUND",
        message: expect.any(String),
        correlation_id: expect.any(String),
      },
    });
    expectSafe(spoofQuery.json());
    expectSafe(crossWorkspace.json());
  });
});
