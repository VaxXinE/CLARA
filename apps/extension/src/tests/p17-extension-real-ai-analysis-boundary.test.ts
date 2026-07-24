import { describe, expect, it, vi } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";
import { normalizeSnapshot } from "../sync/snapshot-normalization";

describe("P17 extension real AI analysis boundary", () => {
  it("posts only sanitized snapshots and never calls the AI analysis route", async () => {
    const fetchImpl = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response("{}", { status: 202 }),
    );
    const client = new ClaraExtensionApiClient({
      baseUrl: "https://api.example.test",
      accessToken: async () => "atk",
      fetchImpl,
    });
    const snapshot = normalizeSnapshot(
      {
        channel: "whatsapp",
        captured_at: "2026-07-24T00:00:00.000Z",
        chat_title: "Customer",
        messages: [{ id: "m1", direction: "incoming", text: "Need help" }],
      },
      "snapshot_hash_p17",
    );

    await client.postSnapshot(snapshot);

    const firstCall = fetchImpl.mock.calls[0];
    expect(firstCall).toBeDefined();
    expect(String(firstCall[0])).toBe(
      "https://api.example.test/api/v1/extension/whatsapp/snapshots",
    );
    expect(String(firstCall[0])).not.toContain("ai-analysis");
    expect(JSON.stringify(firstCall)).not.toMatch(
      /AI_PROVIDER_API_KEY|openai|anthropic/i,
    );
  });
});
