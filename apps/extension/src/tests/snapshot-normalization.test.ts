import { describe, expect, it } from "vitest";
import { normalizeSnapshot } from "../sync/snapshot-normalization";

describe("snapshot normalization", () => {
  it("bounds messages and emits extension provider contract", () => {
    const snapshot = normalizeSnapshot(
      {
        channel: "whatsapp",
        captured_at: "2026-07-13T00:00:00.000Z",
        chat_title: "Budi",
        messages: [
          { id: "1", direction: "incoming", text: "A".repeat(20) },
          { id: "2", direction: "outgoing", text: "second" },
        ],
      },
      "snapshot_hash_demo",
      { maxMessagesPerSnapshot: 1, maxMessageTextLength: 5 },
    );

    expect(snapshot.provider).toBe("extension");
    expect(snapshot.official_api).toBe(false);
    expect(snapshot.messages).toEqual([
      { id: "1", direction: "incoming", text: "AAAAA" },
    ]);
  });
});
