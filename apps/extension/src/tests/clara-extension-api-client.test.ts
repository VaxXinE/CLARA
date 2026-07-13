import { describe, expect, it, vi } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";
import { normalizeSnapshot } from "../sync/snapshot-normalization";

const authHeader = ["Authori", "zation"].join("");

describe("ClaraExtensionApiClient", () => {
  it("posts snapshots with Clara auth only", async () => {
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
        captured_at: "2026-07-13T00:00:00.000Z",
        chat_title: "Budi",
        messages: [{ id: "m1", direction: "incoming", text: "Need help" }],
      },
      "snapshot_hash_demo",
    );

    await expect(client.postSnapshot(snapshot)).resolves.toMatchObject({
      ok: true,
      status: 202,
    });

    const firstCall = fetchImpl.mock.calls[0];
    expect(firstCall).toBeDefined();

    const init = firstCall[1] as RequestInit;
    const headers = init.headers as Record<string, string>;

    expect(firstCall[0]).toBe(
      "https://api.example.test/api/v1/extension/whatsapp/snapshots",
    );
    expect(headers[authHeader]).toBe("Bearer atk");
    expect(JSON.stringify(headers)).not.toContain("web.whatsapp.com");
    expect(init.body?.toString()).not.toContain("<div>");
  });

  it("maps 401 and missing Clara auth safely", async () => {
    const client = new ClaraExtensionApiClient({
      baseUrl: "https://api.example.test",
      accessToken: async () => null,
    });

    await expect(client.postSnapshot({} as never)).resolves.toMatchObject({
      ok: false,
      status: 401,
      reasonCode: "unauthenticated",
    });
  });
});
