import { describe, expect, it } from "vitest";
import { createSnapshotHash } from "../sync/snapshot-hash";

describe("P16 snapshot hash privacy", () => {
  it("is deterministic, privacy-safe, and excludes unsafe non-contract fields", async () => {
    const snapshot = {
      channel: "tiktok" as const,
      captured_at: "2026-07-24T00:00:00.000Z",
      chat_title: " Buyer ",
      messages: [
        {
          id: "m1",
          direction: "incoming" as const,
          text: "Need   help",
        },
      ],
      access_token: "atk",
      rawHtml: "<main>unsafe</main>",
    };

    const first = await createSnapshotHash(snapshot as never);
    const second = await createSnapshotHash({
      ...snapshot,
      captured_at: "2026-07-25T00:00:00.000Z",
      rawHtml: "<main>different unsafe</main>",
    } as never);
    const changedVisibleText = await createSnapshotHash({
      ...snapshot,
      messages: [{ ...snapshot.messages[0], text: "Changed" }],
    } as never);

    expect(second).toBe(first);
    expect(changedVisibleText).not.toBe(first);
    expect(first).toMatch(/^snapshot_/);
    expect(first).not.toContain("Need");
    expect(first).not.toContain("atk");
  });
});
