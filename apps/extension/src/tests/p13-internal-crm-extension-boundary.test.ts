import { describe, expect, it, vi } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P13 internal CRM extension boundary", () => {
  it("does not expose customer mutation methods to the browser extension", () => {
    const client = new ClaraExtensionApiClient({
      baseUrl: "http://127.0.0.1:3000",
      accessToken: async () => "atk",
      fetchImpl: vi.fn(),
    });
    const shape = client as unknown as Record<string, unknown>;

    expect(shape.createCustomer).toBeUndefined();
    expect(shape.updateCustomer).toBeUndefined();
    expect(shape.deleteCustomer).toBeUndefined();
  });

  it("only posts extension snapshots, not customer CRUD payloads", async () => {
    let capturedUrl = "";
    let capturedInit: RequestInit | undefined;
    const fetchImpl = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        capturedUrl = String(input);
        capturedInit = init;

        return new Response(null, { status: 202 });
      },
    );
    const client = new ClaraExtensionApiClient({
      baseUrl: "http://127.0.0.1:3000",
      accessToken: async () => "atk",
      fetchImpl,
    });

    await client.postSnapshot({
      provider: "extension",
      official_api: false,
      channel: "whatsapp",
      captured_at: "2026-07-22T00:00:00.000Z",
      snapshot_hash: "hash_demo",
      chat_title: "Contact",
      messages: [
        {
          id: "msg_demo",
          direction: "incoming",
          text: "Safe preview",
        },
      ],
    });

    expect(capturedUrl).toContain("/api/v1/extension/whatsapp/snapshots");
    expect(capturedUrl).not.toContain("/api/v1/customers");
    expect(capturedInit?.method).toBe("POST");
    expect(String(capturedInit?.body)).not.toContain("displayName");
    expect(String(capturedInit?.body)).not.toContain("client_secret");
  });
});
