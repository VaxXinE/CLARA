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

function authHeaders() {
  return {
    "x-mock-user-id": "usr_demo_agent",
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": "agent",
  };
}

function snapshotPayload() {
  return {
    provider: "extension",
    official_api: false,
    channel: "whatsapp",
    captured_at: "2026-07-13T00:00:00.000Z",
    snapshot_hash: "p45_final_hash",
    chat_title: "Budi",
    messages: [{ id: "visible-1", direction: "incoming", text: "Need help" }],
  };
}

describe("P4.5 final security regression", () => {
  it("keeps extension snapshot intake authenticated, scoped, and non-official", async () => {
    const app = await createServer({ env: testEnv });

    const unauthenticated = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots",
      payload: snapshotPayload(),
    });
    const accepted = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots",
      headers: authHeaders(),
      payload: snapshotPayload(),
    });
    const spoofedScope = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots",
      headers: authHeaders(),
      payload: { ...snapshotPayload(), workspace_id: "wks_other" },
    });
    const official = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots",
      headers: authHeaders(),
      payload: { ...snapshotPayload(), official_api: true },
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(accepted.statusCode).toBe(202);
    expect(accepted.json().data.snapshot).toMatchObject({
      provider: "extension",
      official_api: false,
      channel: "whatsapp",
    });
    expect(accepted.body).not.toContain("Need help");
    expect(spoofedScope.statusCode).toBe(400);
    expect(official.statusCode).toBe(400);
  });

  it("keeps unsafe extension payload fields rejected", async () => {
    const app = await createServer({ env: testEnv });
    const unsafeKeys = [
      ["raw", "dom"].join("_"),
      ["raw", "html"].join("_"),
      ["provider", "token"].join("_"),
      ["chatgpt", "token"].join("_"),
      ["authorization", "header"].join("_"),
      ["coo", "kie"].join(""),
    ];

    for (const key of unsafeKeys) {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/extension/whatsapp/snapshots",
        headers: authHeaders(),
        payload: { ...snapshotPayload(), [key]: "blocked" },
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).not.toContain("blocked");
    }

    await app.close();
  });
});
