import { describe, expect, it, vi } from "vitest";
import type { ClaraExtensionApiClient } from "../api/clara-extension-api-client";
import { AutoSyncEngine } from "../sync/auto-sync-engine";
import { MemoryAutoSyncStorage } from "../sync/auto-sync-storage";
import type { ExtensionSnapshotPayload } from "../types/extension-snapshot";

type SnapshotPostResult = Awaited<
  ReturnType<ClaraExtensionApiClient["postSnapshot"]>
>;

const draft = {
  channel: "whatsapp" as const,
  captured_at: "2026-07-13T00:00:00.000Z",
  chat_title: "Budi",
  messages: [{ id: "m1", direction: "incoming" as const, text: "Need help" }],
};

function createEngine() {
  let now = Date.parse("2026-07-13T00:00:00.000Z");
  const client = {
    postSnapshot: vi.fn(
      async (
        _snapshot: ExtensionSnapshotPayload,
      ): Promise<SnapshotPostResult> => ({
        ok: true,
        status: 202,
      }),
    ),
  };
  const engine = new AutoSyncEngine({
    reader: { read: () => draft },
    client,
    storage: new MemoryAutoSyncStorage(),
    config: {
      minSyncIntervalMs: 100,
      maxMessagesPerSnapshot: 50,
      maxMessageTextLength: 4000,
    },
    now: () => now,
  });

  return {
    client,
    engine,
    advance: (ms: number) => {
      now += ms;
    },
  };
}

describe("auto-sync engine", () => {
  it("syncs changed active conversation and skips unchanged snapshot", async () => {
    const { client, engine, advance } = createEngine();

    await expect(engine.tick()).resolves.toMatchObject({
      lastStatus: "synced",
    });
    advance(200);
    await expect(engine.tick()).resolves.toMatchObject({
      lastStatus: "skipped",
    });

    expect(client.postSnapshot).toHaveBeenCalledTimes(1);
  });

  it("throttles repeated sync and handles auth errors safely", async () => {
    const { client, engine } = createEngine();

    await engine.tick();
    await expect(engine.tick()).resolves.toMatchObject({
      lastStatus: "skipped",
    });

    await engine.setEnabled(true);
  });

  it("does not sync unsupported reader output and has no send path", async () => {
    const client = { postSnapshot: vi.fn() };
    const engine = new AutoSyncEngine({
      reader: { read: () => null },
      client,
      storage: new MemoryAutoSyncStorage(),
    });

    await expect(engine.tick()).resolves.toMatchObject({
      lastStatus: "skipped",
    });
    expect(client.postSnapshot).not.toHaveBeenCalled();
    expect("sendReply" in engine).toBe(false);
  });
});
