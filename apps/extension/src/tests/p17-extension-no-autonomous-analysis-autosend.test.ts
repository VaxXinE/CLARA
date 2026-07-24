import { describe, expect, it, vi } from "vitest";
import type { ClaraExtensionApiClient } from "../api/clara-extension-api-client";
import { AutoSyncEngine } from "../sync/auto-sync-engine";
import { MemoryAutoSyncStorage } from "../sync/auto-sync-storage";
import type { ExtensionSnapshotPayload } from "../types/extension-snapshot";

type SnapshotPostResult = Awaited<
  ReturnType<ClaraExtensionApiClient["postSnapshot"]>
>;

describe("P17 extension no autonomous analysis or auto-send", () => {
  it("sync tick only posts snapshots and does not call analysis or send hooks", async () => {
    const client = {
      postSnapshot: vi.fn(
        async (
          _snapshot: ExtensionSnapshotPayload,
        ): Promise<SnapshotPostResult> => ({
          ok: true,
          status: 202,
        }),
      ),
      analyze: vi.fn(),
      sendReply: vi.fn(),
    };
    const engine = new AutoSyncEngine({
      reader: {
        read: () => ({
          channel: "whatsapp",
          captured_at: "2026-07-24T00:00:00.000Z",
          chat_title: "Customer",
          messages: [{ id: "m1", direction: "incoming", text: "Need help" }],
        }),
      },
      client,
      storage: new MemoryAutoSyncStorage(),
      config: {
        minSyncIntervalMs: 0,
        maxMessagesPerSnapshot: 50,
        maxMessageTextLength: 4000,
      },
      now: () => Date.parse("2026-07-24T00:00:00.000Z"),
    });

    await expect(engine.tick()).resolves.toMatchObject({
      lastStatus: "synced",
    });

    expect(client.postSnapshot).toHaveBeenCalledTimes(1);
    expect(client.analyze).not.toHaveBeenCalled();
    expect(client.sendReply).not.toHaveBeenCalled();
  });
});
