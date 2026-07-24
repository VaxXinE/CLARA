import { describe, expect, it, vi } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

function authHeaders(role: "owner" | "agent" | "viewer" = "agent") {
  return {
    "x-mock-user-id": `usr_demo_${role}`,
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": role,
  };
}

function snapshotBody() {
  const snapshot = p17Snapshot();

  return {
    provider: "extension",
    official_api: false,
    channel: snapshot.channel,
    captured_at: snapshot.capturedAt.toISOString(),
    snapshot_hash: snapshot.snapshotHash,
    chat_title: snapshot.chatTitle,
    chat_subtitle: snapshot.chatSubtitle,
    source_url_origin: snapshot.sourceUrlOrigin,
    messages: snapshot.messages.map((message) => ({
      id: message.id,
      direction: message.direction,
      ...(message.author ? { author: message.author } : {}),
      text: message.text,
      ...(message.timestampLabel
        ? { timestamp_label: message.timestampLabel }
        : {}),
      ...(message.replyContextText
        ? { reply_context_text: message.replyContextText }
        : {}),
    })),
  };
}

describe("P17 real AI analysis route", () => {
  it("requires authentication", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/extension-snapshots/snap_route/ai-analysis",
      payload: { snapshot: snapshotBody() },
    });

    await app.close();
    expect(response.statusCode).toBe(401);
  });

  it("executes safe mock analysis and supports scoped readback", async () => {
    vi.stubEnv("AI_PROVIDER_MODE", "mock");
    vi.stubEnv("AI_MODEL_ALLOWLIST", "mock-model");
    vi.stubEnv("AI_DEFAULT_MODEL", "mock-model");

    const app = await createServer({ env: testEnv });
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/extension-snapshots/snap_route/ai-analysis",
      headers: authHeaders("agent"),
      payload: { snapshot: snapshotBody() },
    });
    const readback = await app.inject({
      method: "GET",
      url: "/api/v1/extension-snapshots/snap_route/ai-analysis",
      headers: authHeaders("agent"),
    });

    await app.close();
    vi.unstubAllEnvs();

    expect(response.statusCode).toBe(201);
    expect(readback.statusCode).toBe(200);
    expect(response.json().data.analysis).toMatchObject({
      status: "generated",
      safeReasonCode: "ok",
      outboundAutoSendEnabled: false,
    });
    expect(JSON.stringify(response.json())).not.toContain("rawProviderPayload");
    expect(JSON.stringify(response.json())).not.toContain("access_token");
  });

  it("blocks viewer and rejects client workspace authority", async () => {
    vi.stubEnv("AI_PROVIDER_MODE", "mock");
    vi.stubEnv("AI_MODEL_ALLOWLIST", "mock-model");
    vi.stubEnv("AI_DEFAULT_MODEL", "mock-model");

    const app = await createServer({ env: testEnv });
    const viewer = await app.inject({
      method: "POST",
      url: "/api/v1/extension-snapshots/snap_viewer/ai-analysis",
      headers: authHeaders("viewer"),
      payload: { snapshot: snapshotBody() },
    });
    const spoofed = await app.inject({
      method: "POST",
      url: "/api/v1/extension-snapshots/snap_spoof/ai-analysis",
      headers: authHeaders("agent"),
      payload: {
        snapshot: snapshotBody(),
        workspaceId: "wks_other",
      },
    });

    await app.close();
    vi.unstubAllEnvs();

    expect(viewer.statusCode).toBe(403);
    expect(spoofed.statusCode).toBe(400);
    expect(JSON.stringify(spoofed.json())).not.toContain("wks_other");
  });
});
