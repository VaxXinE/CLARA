import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P17 extension real AI analysis call boundary", () => {
  it("posts snapshots to CLARA backend ingestion, not an AI analysis endpoint", async () => {
    const requestedUrls: string[] = [];
    const client = new ClaraExtensionApiClient({
      baseUrl: "https://api.example.test",
      accessToken: async () => "atk",
      fetchImpl: (async (input) => {
        requestedUrls.push(String(input));
        return new Response(null, { status: 202 });
      }) as typeof fetch,
    });

    await client.postSnapshot({
      channel: "whatsapp",
      provider: "extension",
      official_api: false,
      captured_at: "2026-07-24T00:00:00.000Z",
      snapshot_hash: "hash",
      chat_title: "Visible chat",
      source_url_origin: "https://web.example.test",
      messages: [],
    });

    expect(requestedUrls).toEqual([
      "https://api.example.test/api/v1/extension/whatsapp/snapshots",
    ]);
    expect(requestedUrls.join(" ")).not.toMatch(/\/ai\/analyze|\/ai\/draft/i);
  });
});
