import { describe, expect, it } from "vitest";
import { createSnapshotHash } from "../sync/snapshot-hash";

const snapshot = {
  channel: "whatsapp" as const,
  captured_at: "2026-07-13T00:00:00.000Z",
  chat_title: "Budi",
  messages: [
    {
      id: "m1",
      direction: "incoming" as const,
      text: "Need help",
    },
  ],
};

describe("snapshot hash", () => {
  it("is deterministic and changes when visible messages change", async () => {
    await expect(createSnapshotHash(snapshot)).resolves.toBe(
      await createSnapshotHash(snapshot),
    );
    await expect(
      createSnapshotHash({
        ...snapshot,
        messages: [{ ...snapshot.messages[0], text: "Changed" }],
      }),
    ).resolves.not.toBe(await createSnapshotHash(snapshot));
  });

  it("excludes unsafe non-contract fields", async () => {
    const base = await createSnapshotHash(snapshot);
    const withUnsafeNoise = await createSnapshotHash({
      ...snapshot,
      ignored: "<div>unsafe</div>",
    } as typeof snapshot);

    expect(withUnsafeNoise).toBe(base);
  });
});
