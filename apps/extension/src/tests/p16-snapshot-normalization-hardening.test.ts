import { describe, expect, it } from "vitest";
import { normalizeSnapshot } from "../sync/snapshot-normalization";

describe("P16 snapshot normalization hardening", () => {
  it("strips unsafe fields and enforces count, length, and whitespace limits", () => {
    const snapshot = normalizeSnapshot(
      {
        channel: "instagram",
        captured_at: "2026-07-24T00:00:00.000Z",
        chat_title: `  ${"A".repeat(300)}  `,
        messages: [
          {
            id: "1",
            direction: "unsafe" as "incoming",
            text: " hello \n\n world ",
            unsafeHtml: "<main>raw</main>",
          },
          {
            id: "2",
            direction: "outgoing",
            text: "x".repeat(20),
            access_token: "atk",
          },
        ],
        cookies: "c",
        rawDom: "<body>raw</body>",
      } as never,
      "snapshot_p16",
      { maxMessagesPerSnapshot: 1, maxMessageTextLength: 8 },
    );

    expect(snapshot.provider).toBe("extension");
    expect(snapshot.official_api).toBe(false);
    expect(snapshot.chat_title).toHaveLength(200);
    expect(snapshot.messages).toEqual([
      { id: "1", direction: "incoming", text: "hello wo" },
    ]);
    expect(JSON.stringify(snapshot)).not.toContain("unsafeHtml");
    expect(JSON.stringify(snapshot)).not.toContain("rawDom");
    expect(JSON.stringify(snapshot)).not.toContain("access_token");
  });
});
