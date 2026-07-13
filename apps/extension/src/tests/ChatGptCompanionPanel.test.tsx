import { describe, expect, it, vi } from "vitest";
import {
  buildChatGptCompanionPanel,
  copyChatGptSafeContext,
  openChatGptCompanion,
} from "../components/ChatGptCompanionPanel";
import type { ExtensionSnapshotPayload } from "../types/extension-snapshot";

const snapshot: ExtensionSnapshotPayload = {
  provider: "extension",
  official_api: false,
  channel: "whatsapp",
  captured_at: "2026-07-13T00:00:00.000Z",
  snapshot_hash: "hash_demo",
  chat_title: "Budi",
  messages: [{ id: "m1", direction: "incoming", text: "Need help" }],
};

describe("ChatGPT companion panel", () => {
  it("renders safe preview state", () => {
    const panel = buildChatGptCompanionPanel({ snapshot });

    expect(panel.title).toBe("ChatGPT Companion");
    expect(panel.preview).toContain("channel: whatsapp");
    expect(panel.preview).toContain("Need help");
    expect(panel.canCopy).toBe(true);
  });

  it("copies safe context only when explicitly called", async () => {
    const writeText = vi.fn(async (_value: string) => undefined);

    await expect(
      copyChatGptSafeContext({
        context: "safe prompt",
        clipboard: { writeText },
      }),
    ).resolves.toEqual({ ok: true });
    expect(writeText).toHaveBeenCalledWith("safe prompt");
  });

  it("opens configured companion URL only when explicitly called", () => {
    const openWindow = vi.fn();
    const result = openChatGptCompanion({
      companionUrl: "https://chatgpt.com/g/demo?unsafe=1",
      openWindow,
    });

    expect(result).toEqual({ ok: true, url: "https://chatgpt.com/g/demo" });
    expect(openWindow).toHaveBeenCalledWith(
      "https://chatgpt.com/g/demo",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("returns safe error when opening is blocked", () => {
    const result = openChatGptCompanion({
      openWindow: () => {
        throw new Error("blocked");
      },
    });

    expect(result).toEqual({ ok: false, url: "https://chatgpt.com/" });
  });
});
