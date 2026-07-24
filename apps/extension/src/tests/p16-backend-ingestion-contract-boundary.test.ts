import { describe, expect, it } from "vitest";
import { normalizeSnapshot } from "../sync/snapshot-normalization";

describe("P16 backend ingestion contract extension boundary", () => {
  it("emits the safe backend ingestion snapshot contract", () => {
    const snapshot = normalizeSnapshot(
      {
        channel: "whatsapp",
        captured_at: "2026-07-24T00:00:00.000Z",
        chat_title: "Lead",
        chat_subtitle: "Visible active chat",
        source_url_origin: "https://web.whatsapp.example.test",
        messages: [
          {
            id: "m1",
            direction: "incoming",
            author: "Lead",
            text: "hello",
            timestamp_label: "Today",
          },
        ],
      },
      "snapshot_hash_backend_contract",
    );
    const serialized = JSON.stringify(snapshot);

    expect(snapshot.provider).toBe("extension");
    expect(snapshot.official_api).toBe(false);
    expect(snapshot.messages).toHaveLength(1);
    expect(serialized).not.toContain("rawHtml");
    expect(serialized).not.toContain("rawDom");
    expect(serialized).not.toContain("Authorization");
  });
});
