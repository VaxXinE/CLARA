import { createHmac } from "node:crypto";
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
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: "vt",
  WHATSAPP_WEBHOOK_APP_SECRET: "as",
});

function authHeaders(role: "owner" | "agent" | "viewer" = "agent") {
  return {
    "x-mock-user-id": `usr_demo_${role}`,
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": role,
  };
}

function whatsappTextPayload(id: string) {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            value: {
              metadata: {
                phone_number_id: "wa_phone_demo",
              },
              contacts: [
                {
                  profile: {
                    name: "Ada",
                  },
                },
              ],
              messages: [
                {
                  id,
                  from: "628000000001",
                  timestamp: "1780000000",
                  type: "text",
                  text: {
                    body: "Need help with my order",
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function sign(body: unknown): string {
  return `sha256=${createHmac("sha256", "as")
    .update(JSON.stringify(body))
    .digest("hex")}`;
}

async function createWhatsappConversation(
  app: Awaited<ReturnType<typeof createServer>>,
  id: string,
) {
  const payload = whatsappTextPayload(id);
  const response = await app.inject({
    method: "POST",
    url: "/api/v1/whatsapp/webhook",
    payload,
    headers: {
      "x-hub-signature-256": sign(payload),
    },
  });

  expect(response.statusCode).toBe(202);

  return response.json().data.conversation_id as string;
}

describe("POST /api/v1/conversations/:conversation_id/reply for WhatsApp", () => {
  it("allows agent human-triggered WhatsApp reply and returns safe DTO", async () => {
    const app = await createServer({ env: testEnv });
    const conversationId = await createWhatsappConversation(
      app,
      "wamid_reply_route_1",
    );

    const response = await app.inject({
      method: "POST",
      url: `/api/v1/conversations/${conversationId}/reply?organization_id=evil&workspace_id=evil`,
      headers: authHeaders("agent"),
      payload: {
        body: "We can help with that.",
      },
    });

    await app.close();

    const body = response.json();
    const serialized = JSON.stringify(body);

    expect(response.statusCode).toBe(201);
    expect(body.data.send).toMatchObject({
      provider: "whatsapp",
      status: "simulated",
      outbound_delivery_id: expect.any(String),
      reason_code: "simulated_send_completed",
    });
    expect(serialized).not.toContain("evil");
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("raw_provider");
    expect(serialized).not.toContain("client_secret");
  });

  it("rejects client-provided organization and workspace fields in the body", async () => {
    const app = await createServer({ env: testEnv });
    const conversationId = await createWhatsappConversation(
      app,
      "wamid_reply_route_spoof",
    );

    const response = await app.inject({
      method: "POST",
      url: `/api/v1/conversations/${conversationId}/reply`,
      headers: authHeaders("agent"),
      payload: {
        body: "We can help with that.",
        organization_id: "evil",
        workspace_id: "evil",
      },
    });
    const serialized = response.body;

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(serialized).not.toContain("org_demo");
    expect(serialized).not.toContain("wks_demo_sales");
  });

  it("blocks viewer and cross-workspace WhatsApp replies safely", async () => {
    const app = await createServer({ env: testEnv });
    const conversationId = await createWhatsappConversation(
      app,
      "wamid_reply_route_2",
    );

    const viewer = await app.inject({
      method: "POST",
      url: `/api/v1/conversations/${conversationId}/reply`,
      headers: authHeaders("viewer"),
      payload: {
        body: "Viewer cannot send.",
      },
    });
    const crossWorkspace = await app.inject({
      method: "POST",
      url: `/api/v1/conversations/${conversationId}/reply`,
      headers: {
        "x-mock-user-id": "usr_demo_other_agent",
        "x-mock-organization-id": "org_demo_other",
        "x-mock-workspace-id": "wks_demo_other",
        "x-mock-role": "agent",
      },
      payload: {
        body: "Wrong workspace.",
      },
    });

    await app.close();

    expect(viewer.statusCode).toBe(403);
    expect(crossWorkspace.statusCode).toBe(404);
  });
});
