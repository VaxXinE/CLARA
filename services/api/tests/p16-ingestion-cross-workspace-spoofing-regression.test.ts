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

describe("P16 ingestion cross-workspace spoofing regression", () => {
  it("rejects body-provided organization_id and workspace_id", async () => {
    const app = await createServer({ env });
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/extension/tiktok/snapshots",
      headers: {
        "x-mock-user-id": "usr_p16_agent",
        "x-mock-organization-id": "org_p16",
        "x-mock-workspace-id": "wks_p16",
        "x-mock-role": "agent",
      },
      payload: {
        provider: "extension",
        official_api: false,
        channel: "tiktok",
        captured_at: "2026-07-24T00:00:00.000Z",
        snapshot_hash: "snapshot_hash_spoof",
        chat_title: "Lead",
        organization_id: "org_other",
        workspace_id: "wks_other",
        messages: [{ id: "m1", direction: "incoming", text: "hello" }],
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.body).not.toContain("org_other");
    expect(response.body).not.toContain("wks_other");
  });
});
