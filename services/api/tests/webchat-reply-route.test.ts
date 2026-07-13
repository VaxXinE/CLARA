import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
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

const agentHeaders = authHeaders({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("webchat reply route", () => {
  it("requires authentication and blocks viewer mutation", async () => {
    const app = await createServer({ env: testEnv });

    const unauthenticated = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_sari_followup/reply",
      payload: {
        body: "Hello",
      },
    });
    const viewer = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_sari_followup/reply",
      headers: authHeaders({
        userId: "usr_demo_viewer",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "viewer",
      }),
      payload: {
        body: "Hello",
      },
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(viewer.statusCode).toBe(403);
  });

  it("sends a human-triggered Webchat reply and returns safe status", async () => {
    const app = await createServer({ env: testEnv });

    const send = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_sari_followup/reply?organization_id=evil&workspace_id=evil",
      headers: agentHeaders,
      payload: {
        body: "  Hi Sari, we can help from Webchat.  ",
      },
    });

    expect(send.statusCode).toBe(201);
    expect(send.json().data.message).toMatchObject({
      conversation_id: "conv_demo_sari_followup",
      direction: "outbound",
      body: "Hi Sari, we can help from Webchat.",
    });
    expect(send.json().data.send).toMatchObject({
      provider: "webchat",
      status: "simulated",
      outbound_delivery_id: expect.any(String),
      reason_code: "simulated_send_completed",
    });

    const deliveryId = send.json().data.send.outbound_delivery_id as string;
    const status = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/webchat/outbound/deliveries/${deliveryId}?organization_id=evil&workspace_id=evil`,
      headers: agentHeaders,
      payload: {
        organization_id: "evil",
        workspace_id: "evil",
      },
    });
    const viewerStatus = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/webchat/outbound/deliveries/${deliveryId}`,
      headers: authHeaders({
        userId: "usr_demo_viewer",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "viewer",
      }),
    });
    const statusBody = status.json();
    const serialized = JSON.stringify(statusBody);

    await app.close();

    expect(status.statusCode).toBe(200);
    expect(viewerStatus.statusCode).toBe(200);
    expect(statusBody.data).toMatchObject({
      outbound_delivery_id: deliveryId,
      provider: "webchat",
      status: "simulated",
      conversation_id: "conv_demo_sari_followup",
      channel_account_id: "channel_account_demo_webchat",
    });
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("cookie");
    expect(serialized).not.toContain("raw_provider");
    expect(serialized).not.toContain("Hi Sari");
  });

  it("returns safe 404 for cross-workspace delivery reads", async () => {
    const app = await createServer({ env: testEnv });
    const send = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_sari_followup/reply",
      headers: agentHeaders,
      payload: {
        body: "Scoped status please.",
      },
    });
    const deliveryId = send.json().data.send.outbound_delivery_id as string;
    const crossWorkspace = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/webchat/outbound/deliveries/${deliveryId}`,
      headers: authHeaders({
        userId: "usr_demo_other_agent",
        organizationId: "org_demo_other",
        workspaceId: "wks_demo_other",
        role: "agent",
      }),
    });

    await app.close();

    expect(crossWorkspace.statusCode).toBe(404);
  });
});
