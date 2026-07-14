import { describe, expect, it, vi } from "vitest";
import { extensionBackground } from "../background";
import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";
import { openChatGptCompanion } from "../components/ChatGptCompanionPanel";
import { WhatsappActiveChatReader } from "../readers/whatsapp-active-chat-reader";
import { AutoSyncEngine } from "../sync/auto-sync-engine";
import { MemoryAutoSyncStorage } from "../sync/auto-sync-storage";
import type { ExtensionSnapshotPayload } from "../types/extension-snapshot";

describe("P5 final extension security regression", () => {
  it("syncs only active visible chat snapshots and never sends replies", async () => {
    const postSnapshot = vi.fn(async () => ({ ok: true, status: 202 }));
    const storage = new MemoryAutoSyncStorage();
    const engine = new AutoSyncEngine({
      client: { postSnapshot },
      storage,
      now: () => 1_700_000_000_000,
      reader: {
        read: () => ({
          channel: "whatsapp",
          captured_at: "2026-07-14T00:00:00.000Z",
          chat_title: "Visible chat",
          source_url_origin: "https://web.whatsapp.com",
          messages: [
            {
              id: "m1",
              direction: "incoming",
              text: "Visible message only",
            },
          ],
        }),
      },
    });

    const result = await engine.tick();

    expect(result.lastStatus).toBe("synced");
    expect(postSnapshot).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(postSnapshot.mock.calls)).not.toContain(
      "access_token",
    );
    expect(JSON.stringify(postSnapshot.mock.calls)).not.toContain(
      "refresh_token",
    );
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
    expect("providerCookie" in result).toBe(false);
    expect("sessionCookie" in result).toBe(false);
    expect("providerToken" in result).toBe(false);
  });

  it("reads text content only and does not include raw DOM or HTML", () => {
    document.body.innerHTML = `
      <main>
        <h1 data-clara-chat-title>Budi</h1>
        <p data-clara-message data-clara-direction="incoming">
          Halo <strong>CLARA</strong>
        </p>
      </main>
    `;

    const snapshot = new WhatsappActiveChatReader(document).read();

    expect(snapshot?.chat_title).toBe("Budi");
    expect(snapshot?.messages[0]?.text).toBe("Halo CLARA");
    expect(JSON.stringify(snapshot)).not.toContain("<strong>");
    expect(JSON.stringify(snapshot)).not.toContain("innerHTML");
  });

  it("keeps ChatGPT companion preview/copy/open manual only", () => {
    const snapshot: ExtensionSnapshotPayload = {
      provider: "extension",
      official_api: false,
      channel: "whatsapp",
      captured_at: "2026-07-14T00:00:00.000Z",
      snapshot_hash: "p5_hash",
      chat_title: "Budi",
      messages: [{ id: "m1", direction: "incoming", text: "A".repeat(600) }],
    };
    const context = buildChatGptSafeContext(snapshot, {
      messageTextLimit: 40,
      promptLengthLimit: 500,
    });
    const openResult = openChatGptCompanion({
      companionUrl: "https://chatgpt.com/?unsafe=1",
      openWindow: () => undefined,
    });

    expect(context).toContain("human operator explicitly reviews");
    expect(context).toContain("[truncated]");
    expect(openResult).toEqual({ ok: true, url: "https://chatgpt.com/" });
    expect(JSON.stringify({ context, openResult })).not.toContain(
      "access_token",
    );
    expect(JSON.stringify({ context, openResult })).not.toContain(
      "refresh_token",
    );
  });
});
