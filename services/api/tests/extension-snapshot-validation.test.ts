import { describe, expect, it } from "vitest";
import { parseExtensionSnapshotPayload } from "../src/extension/extension-snapshot-validation";

const unsafeKey = (...parts: string[]) => parts.join("_");

function validPayload() {
  return {
    provider: "extension",
    official_api: false,
    channel: "whatsapp",
    captured_at: "2026-07-13T00:00:00.000Z",
    snapshot_hash: "snapshot_hash_123",
    chat_title: "Budi",
    source_url_origin: "https://web.whatsapp.example.test",
    messages: [
      {
        id: "local-1",
        direction: "incoming",
        author: "Budi",
        text: "Need help",
      },
    ],
  };
}

describe("extension snapshot validation", () => {
  it("normalizes a safe extension snapshot", () => {
    const result = parseExtensionSnapshotPayload({
      channel: "whatsapp",
      body: validPayload(),
    });

    expect(result).toMatchObject({
      provider: "extension",
      officialApi: false,
      channel: "whatsapp",
      snapshotHash: "snapshot_hash_123",
      chatTitle: "Budi",
      sourceUrlOrigin: "https://web.whatsapp.example.test",
    });
    expect(result.messages).toHaveLength(1);
  });

  it("rejects unsafe capture fields", () => {
    expect(() =>
      parseExtensionSnapshotPayload({
        channel: "whatsapp",
        body: {
          ...validPayload(),
          [unsafeKey("raw", "html")]: "<div>unsafe</div>",
        },
      }),
    ).toThrow("Invalid request.");
  });

  it("rejects channel mismatch and full URLs", () => {
    expect(() =>
      parseExtensionSnapshotPayload({
        channel: "instagram",
        body: validPayload(),
      }),
    ).toThrow("Invalid request.");

    expect(() =>
      parseExtensionSnapshotPayload({
        channel: "whatsapp",
        body: {
          ...validPayload(),
          source_url_origin: "https://web.whatsapp.example.test/chat?id=1",
        },
      }),
    ).toThrow("Invalid request.");
  });
});
