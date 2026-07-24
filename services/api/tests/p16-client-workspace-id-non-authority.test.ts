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

function headers() {
  return {
    "x-mock-user-id": "usr_owner",
    "x-mock-organization-id": "org_from_auth",
    "x-mock-workspace-id": "wks_from_auth",
    "x-mock-role": "owner",
  };
}

function payload() {
  return {
    provider: "extension",
    official_api: false,
    channel: "whatsapp",
    captured_at: "2026-07-24T00:00:00.000Z",
    snapshot_hash: "snapshot_hash_client_scope",
    chat_title: "Lead",
    messages: [{ id: "m1", direction: "incoming", text: "Need help" }],
  };
}

describe("P16 client workspaceId non-authority", () => {
  it("rejects client-supplied workspace identifiers in snapshot requests", async () => {
    const app = await createServer({ env });

    const bodyResponse = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots",
      headers: headers(),
      payload: { ...payload(), workspace_id: "wks_spoof" },
    });
    const queryResponse = await app.inject({
      method: "POST",
      url: "/api/v1/extension/whatsapp/snapshots?workspace_id=wks_spoof",
      headers: headers(),
      payload: payload(),
    });

    await app.close();

    expect(bodyResponse.statusCode).toBe(400);
    expect(queryResponse.statusCode).toBe(400);
  });
});
