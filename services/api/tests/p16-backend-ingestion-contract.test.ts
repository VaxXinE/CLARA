import { describe, expect, it } from "vitest";
import { parseExtensionSnapshotPayload } from "../src/extension/extension-snapshot-validation";

describe("P16 backend ingestion contract", () => {
  it("accepts only the sanitized/redacted extension snapshot contract", () => {
    const snapshot = parseExtensionSnapshotPayload({
      channel: "whatsapp",
      body: {
        provider: "extension",
        official_api: false,
        channel: "whatsapp",
        captured_at: "2026-07-24T00:00:00.000Z",
        snapshot_hash: "snapshot_hash_contract",
        chat_title: "Lead",
        chat_subtitle: "Visible chat",
        source_url_origin: "https://web.whatsapp.example.test",
        messages: [
          {
            id: "m1",
            direction: "incoming",
            author: "Lead",
            text: "hello",
            timestamp_label: "Today",
            reply_context_text: "prior visible text",
          },
        ],
      },
    });
    const serialized = JSON.stringify(snapshot);

    expect(snapshot.provider).toBe("extension");
    expect(snapshot.officialApi).toBe(false);
    expect(snapshot.channel).toBe("whatsapp");
    expect(snapshot.messages).toHaveLength(1);
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
  });
});
