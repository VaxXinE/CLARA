import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import { WEBCHAT_MESSAGE_MAX_LENGTH } from "../src/channels/webchat/webchat-inbound-types";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

function validBody() {
  return {
    channel_public_key: "webchat_public_demo",
    visitor_id: "visitor-1",
    session_id: "session-1",
    customer_name: "Ada",
    customer_email: "ada@example.test",
    message_text: "Need help",
    page_url: "https://example.test/pricing",
    metadata: {
      locale: "en",
    },
  };
}

describe("POST /api/v1/webchat/inbound/messages", () => {
  it("accepts valid public webchat inbound message safely", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/webchat/inbound/messages?organization_id=evil&workspace_id=evil",
      payload: validBody(),
      headers: {
        authorization: "Bearer should-not-be-used",
        cookie: "session=should-not-be-used",
      },
    });

    await app.close();

    const serialized = JSON.stringify(response.json());

    expect(response.statusCode).toBe(202);
    expect(response.json()).toMatchObject({
      data: {
        received: true,
        customer_id: expect.any(String),
        conversation_id: expect.any(String),
        message_id: expect.any(String),
      },
    });
    expect(serialized).not.toContain("organization_id");
    expect(serialized).not.toContain("workspace_id");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("cookie");
    expect(serialized).not.toContain("raw_provider");
  });

  it("rejects missing or unknown channel key", async () => {
    const app = await createServer({ env: testEnv });

    const missing = await app.inject({
      method: "POST",
      url: "/api/v1/webchat/inbound/messages",
      payload: {
        message_text: "Need help",
      },
    });
    const unknown = await app.inject({
      method: "POST",
      url: "/api/v1/webchat/inbound/messages",
      payload: {
        ...validBody(),
        channel_public_key: "missing",
      },
    });

    await app.close();

    expect(missing.statusCode).toBe(400);
    expect(unknown.statusCode).toBe(404);
  });

  it("rejects invalid public input", async () => {
    const app = await createServer({ env: testEnv });

    for (const payload of [
      {
        ...validBody(),
        message_text: "",
      },
      {
        ...validBody(),
        message_text: "x".repeat(WEBCHAT_MESSAGE_MAX_LENGTH + 1),
      },
      {
        ...validBody(),
        customer_email: "not-an-email",
      },
      {
        ...validBody(),
        page_url: "javascript:alert(1)",
      },
      {
        ...validBody(),
        organization_id: "evil",
      },
    ]) {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/webchat/inbound/messages",
        payload,
      });

      expect(response.statusCode).toBe(400);
    }

    await app.close();
  });
});
