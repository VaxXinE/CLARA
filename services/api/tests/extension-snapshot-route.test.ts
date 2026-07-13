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

const unsafeKey = (...parts: string[]) => parts.join("_");

function authHeaders(role: "owner" | "agent" | "viewer" = "agent") {
  return {
    "x-mock-user-id": `usr_demo_${role}`,
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": role,
  };
}

function payload(channel: "whatsapp" | "instagram" | "tiktok" = "whatsapp") {
  return {
    provider: "extension",
    official_api: false,
    channel,
    captured_at: "2026-07-13T00:00:00.000Z",
    snapshot_hash: `snapshot_hash_${channel}`,
    chat_title: "Budi",
    chat_subtitle: "Active chat",
    source_url_origin: "https://provider.example.test",
    messages: [
      {
        id: "local-1",
        direction: "incoming",
        author: "Budi",
        text: "Need help",
        timestamp_label: "Today",
      },
      {
        id: "local-2",
        direction: "outgoing",
        author: "Agent",
        text: "We can help.",
      },
    ],
  };
}

describe("extension snapshot route", () => {
  it("requires auth and blocks viewer", async () => {
    const app = await createServer({ env: testEnv });

    const unauthenticated = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots",
      payload: payload(),
    });
    const viewer = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots",
      headers: authHeaders("viewer"),
      payload: payload(),
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(viewer.statusCode).toBe(403);
  });

  it.each(["whatsapp", "instagram", "tiktok"] as const)(
    "accepts %s extension snapshots as non-official provider data",
    async (channel) => {
      const app = await createServer({ env: testEnv });

      const response = await app.inject({
        method: "POST",
        url: `/api/v1/extension/${channel}/snapshots`,
        headers: authHeaders("agent"),
        payload: payload(channel),
      });

      await app.close();

      expect(response.statusCode).toBe(202);
      expect(response.json()).toMatchObject({
        data: {
          snapshot: {
            status: "accepted",
            duplicate: false,
            provider: "extension",
            official_api: false,
            channel,
            message_count: 2,
            incoming_count: 1,
            outgoing_count: 1,
          },
        },
      });
      expect(response.body).not.toContain("Need help");
      expect(response.body).not.toContain("We can help.");
    },
  );

  it("deduplicates snapshots and rejects unsafe client scope fields", async () => {
    const app = await createServer({ env: testEnv });

    const first = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots",
      headers: authHeaders("owner"),
      payload: payload(),
    });
    const second = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots",
      headers: authHeaders("owner"),
      payload: payload(),
    });
    const scopedBody = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots",
      headers: authHeaders("owner"),
      payload: {
        ...payload(),
        organization_id: "org_other",
      },
    });
    const scopedQuery = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots?workspace_id=wks_other",
      headers: authHeaders("owner"),
      payload: payload(),
    });

    await app.close();

    expect(first.statusCode).toBe(202);
    expect(second.statusCode).toBe(200);
    expect(second.json().data.snapshot.duplicate).toBe(true);
    expect(scopedBody.statusCode).toBe(400);
    expect(scopedQuery.statusCode).toBe(400);
  });

  it("rejects unsupported channels, mismatches, official mode, and unsafe fields", async () => {
    const app = await createServer({ env: testEnv });

    const unsupported = await app.inject({
      method: "POST",
      url: "/api/v1/extension/email/snapshots",
      headers: authHeaders("agent"),
      payload: { ...payload(), channel: "email" },
    });
    const mismatch = await app.inject({
      method: "POST",
      url: "/api/v1/extension/instagram/snapshots",
      headers: authHeaders("agent"),
      payload: payload("whatsapp"),
    });
    const official = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots",
      headers: authHeaders("agent"),
      payload: { ...payload(), official_api: true },
    });
    const unsafe = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots",
      headers: authHeaders("agent"),
      payload: {
        ...payload(),
        [unsafeKey("provider", "to", "ken")]: "ptk",
      },
    });

    await app.close();

    expect(unsupported.statusCode).toBe(400);
    expect(mismatch.statusCode).toBe(400);
    expect(official.statusCode).toBe(400);
    expect(unsafe.statusCode).toBe(400);
  });
});
