import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import { WHATSAPP_MESSAGE_MAX_LENGTH } from "../src/channels/whatsapp/whatsapp-webhook-types";

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

function whatsappTextPayload(overrides: Record<string, unknown> = {}) {
  return {
    object: "whatsapp_business_account",
    organization_id: "evil",
    workspace_id: "evil",
    entry: [
      {
        changes: [
          {
            value: {
              metadata: {
                phone_number_id: "wa_phone_demo",
                display_phone_number: "15550000000",
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
                  id: "wamid_route_1",
                  from: "628000000001",
                  timestamp: "1780000000",
                  type: "text",
                  text: {
                    body: "Need help with my order",
                  },
                  ...overrides,
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

describe("WhatsApp webhook routes", () => {
  it("returns the configured verification challenge safely", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=vt&hub.challenge=challenge-1",
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("challenge-1");
    expect(response.headers["content-type"]).toContain("text/plain");
  });

  it("rejects invalid verification and invalid webhook signatures", async () => {
    const app = await createServer({ env: testEnv });
    const payload = whatsappTextPayload();

    const verification = await app.inject({
      method: "GET",
      url: "/api/v1/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=bad&hub.challenge=challenge-1",
    });
    const inbound = await app.inject({
      method: "POST",
      url: "/api/v1/whatsapp/webhook",
      payload,
      headers: {
        "x-hub-signature-256": "sha256=bad",
      },
    });

    await app.close();

    expect(verification.statusCode).toBe(403);
    expect(inbound.statusCode).toBe(403);
  });

  it("accepts signed text webhook and derives scope from channel account", async () => {
    const app = await createServer({ env: testEnv });
    const payload = whatsappTextPayload();

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/whatsapp/webhook?organization_id=evil&workspace_id=evil",
      payload,
      headers: {
        "x-hub-signature-256": sign(payload),
        authorization: "Bearer should-not-be-used",
        cookie: "session=should-not-be-used",
      },
    });

    await app.close();

    const body = response.json();
    const serialized = JSON.stringify(body);

    expect(response.statusCode).toBe(202);
    expect(body).toMatchObject({
      data: {
        received: true,
        duplicate: false,
        customer_id: expect.any(String),
        conversation_id: expect.any(String),
        message_id: expect.any(String),
      },
    });
    expect(serialized).not.toContain("evil");
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("cookie");
    expect(serialized).not.toContain("raw_provider");
  });

  it("preserves idempotency for duplicate provider messages", async () => {
    const app = await createServer({ env: testEnv });
    const payload = whatsappTextPayload({
      id: "wamid_duplicate_route",
    });

    const first = await app.inject({
      method: "POST",
      url: "/api/v1/whatsapp/webhook",
      payload,
      headers: {
        "x-hub-signature-256": sign(payload),
      },
    });
    const second = await app.inject({
      method: "POST",
      url: "/api/v1/whatsapp/webhook",
      payload,
      headers: {
        "x-hub-signature-256": sign(payload),
      },
    });

    await app.close();

    expect(first.statusCode).toBe(202);
    expect(second.statusCode).toBe(202);
    expect(second.json().data.duplicate).toBe(true);
    expect(second.json().data.conversation_id).toBe(
      first.json().data.conversation_id,
    );
  });

  it("rejects missing channel mapping and invalid message bodies safely", async () => {
    const app = await createServer({ env: testEnv });
    const missingChannel = whatsappTextPayload({
      id: "wamid_missing_channel",
    });
    const invalidType = whatsappTextPayload({
      id: "wamid_invalid_type",
      type: "image",
      text: undefined,
    });
    const tooLong = whatsappTextPayload({
      id: "wamid_too_long",
      text: {
        body: "x".repeat(WHATSAPP_MESSAGE_MAX_LENGTH + 1),
      },
    });

    missingChannel.entry[0]!.changes[0]!.value.metadata.phone_number_id =
      "missing_phone";

    const responses = await Promise.all(
      [missingChannel, invalidType, tooLong].map((payload) =>
        app.inject({
          method: "POST",
          url: "/api/v1/whatsapp/webhook",
          payload,
          headers: {
            "x-hub-signature-256": sign(payload),
          },
        }),
      ),
    );

    await app.close();

    expect(responses[0]!.statusCode).toBe(404);
    expect(responses[1]!.statusCode).toBe(400);
    expect(responses[2]!.statusCode).toBe(400);
  });
});
