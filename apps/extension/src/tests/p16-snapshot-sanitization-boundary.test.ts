import { describe, expect, it } from "vitest";
import { normalizeSnapshot } from "../sync/snapshot-normalization";

describe("P16 snapshot sanitization extension boundary", () => {
  it("normalizes only the safe extension snapshot contract", () => {
    const snapshot = normalizeSnapshot(
      {
        channel: "whatsapp",
        captured_at: "2026-07-24T00:00:00.000Z",
        chat_title: " Lead ",
        messages: [
          {
            id: "m1",
            direction: "incoming",
            text: " hello ",
            rawDom: "<body>unsafe</body>",
          },
        ],
        rawHtml: "<main>unsafe</main>",
      } as never,
      "snapshot_hash_sanitize",
    );
    const serialized = JSON.stringify(snapshot);

    expect(snapshot.provider).toBe("extension");
    expect(snapshot.official_api).toBe(false);
    expect(serialized).not.toContain("rawDom");
    expect(serialized).not.toContain("rawHtml");
  });
});
