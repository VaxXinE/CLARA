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

describe("P16 cross-workspace spoofing regression", () => {
  it("rejects spoofed organization and workspace body fields", async () => {
    const app = await createServer({ env });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/extension/instagram/snapshots",
      headers: {
        "x-mock-user-id": "usr_agent",
        "x-mock-organization-id": "org_auth",
        "x-mock-workspace-id": "wks_auth",
        "x-mock-role": "agent",
      },
      payload: {
        provider: "extension",
        official_api: false,
        channel: "instagram",
        captured_at: "2026-07-24T00:00:00.000Z",
        snapshot_hash: "snapshot_hash_spoof",
        chat_title: "Lead",
        organization_id: "org_other",
        workspace_id: "wks_other",
        messages: [{ id: "m1", direction: "incoming", text: "Need help" }],
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.body).not.toContain("org_other");
    expect(response.body).not.toContain("wks_other");
  });
});
