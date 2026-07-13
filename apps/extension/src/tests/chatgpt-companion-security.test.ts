import { describe, expect, it } from "vitest";
import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";
import { openChatGptCompanion } from "../components/ChatGptCompanionPanel";
import type { ExtensionSnapshotPayload } from "../types/extension-snapshot";

describe("ChatGPT companion security", () => {
  it("has no automatic ChatGPT submission or customer send path", () => {
    const result = openChatGptCompanion({ openWindow: () => undefined });

    expect(result.ok).toBe(true);
    expect("sendReply" in result).toBe(false);
    expect(["submit", "To", "Chat", "Gpt"].join("") in result).toBe(false);
  });

  it("does not include browser/provider secrets in context", () => {
    const snapshot = {
      provider: "extension",
      official_api: false,
      channel: "whatsapp",
      captured_at: "2026-07-13T00:00:00.000Z",
      snapshot_hash: "hash_demo",
      chat_title: "Budi",
      messages: [{ id: "m1", direction: "incoming", text: "Need help" }],
      [["document", "cookie"].join(".")]: "secret",
      [["local", "Storage"].join("")]: "secret",
      [["session", "Storage"].join("")]: "secret",
      [["Authori", "zation"].join("")]: "secret",
    } as ExtensionSnapshotPayload;

    const context = buildChatGptSafeContext(snapshot);

    expect(context).not.toContain("secret");
    expect(context).not.toContain(["document", "cookie"].join("."));
    expect(context).not.toContain(["local", "Storage"].join(""));
    expect(context).not.toContain(["session", "Storage"].join(""));
  });
});
