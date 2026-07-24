import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";

const env = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

function headers(role: "agent" | "viewer" = "agent") {
  return {
    "x-mock-user-id": `usr_p16_${role}`,
    "x-mock-organization-id": "org_p16",
    "x-mock-workspace-id": "wks_p16",
    "x-mock-role": role,
  };
}

const body = {
  provider: "extension",
  official_api: false,
  channel: "whatsapp",
  captured_at: "2026-07-24T00:00:00.000Z",
  snapshot_hash: "snapshot_hash_auth_boundary",
  chat_title: "Lead",
  messages: [{ id: "m1", direction: "incoming", text: "hello" }],
};

describe("P16 ingestion auth workspace boundary", () => {
  it("requires auth, blocks viewer, and rejects client workspace query", async () => {
    const app = await createServer({ env });

    const unauthenticated = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots",
      payload: body,
    });
    const viewer = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots",
      headers: headers("viewer"),
      payload: body,
    });
    const spoofedQuery = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots?workspaceId=wks_other",
      headers: headers("agent"),
      payload: body,
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(viewer.statusCode).toBe(403);
    expect(spoofedQuery.statusCode).toBe(400);
  });
});
