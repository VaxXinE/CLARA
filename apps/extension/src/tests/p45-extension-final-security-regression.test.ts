import { describe, expect, it } from "vitest";
import { ClaraSession } from "../auth/clara-session";
import { extensionBackground } from "../background";
import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";
import { openChatGptCompanion } from "../components/ChatGptCompanionPanel";
import type { ExtensionSnapshotPayload } from "../types/extension-snapshot";

describe("P4.5 extension final security regression", () => {
  it("keeps extension bridge operator-assisted and active-conversation scoped", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
  });

  it("keeps ChatGPT context bounded and non-automatic", () => {
    const snapshot: ExtensionSnapshotPayload = {
      provider: "extension",
      official_api: false,
      channel: "whatsapp",
      captured_at: "2026-07-13T00:00:00.000Z",
      snapshot_hash: "p45_final_hash",
      chat_title: "Budi",
      messages: [{ id: "m1", direction: "incoming", text: "A".repeat(1000) }],
    };
    const context = buildChatGptSafeContext(snapshot, {
      messageTextLimit: 20,
      promptLengthLimit: 400,
    });

    expect(context.length).toBeLessThanOrEqual(400);
    expect(context).toContain("provider: extension");
    expect(context).toContain("official_api: false");
    expect(context).toContain("[truncated]");
  });

  it("keeps auth and ChatGPT actions explicit", () => {
    const session = new ClaraSession({
      config: { claraAllowedOrigins: ["https://clara.example.test"] },
    });
    const openResult = openChatGptCompanion({
      companionUrl: "https://chatgpt.com/?unsafe=1",
      openWindow: () => undefined,
    });

    expect(session.isAllowedClaraOrigin("https://clara.example.test")).toBe(
      true,
    );
    expect(session.isAllowedClaraOrigin("https://web.whatsapp.com")).toBe(
      false,
    );
    expect(session.isAllowedClaraOrigin("https://chat.openai.com")).toBe(false);
    expect(openResult).toEqual({ ok: true, url: "https://chatgpt.com/" });
    expect(["send", "Reply"].join("") in openResult).toBe(false);
    expect(["submit", "To", "Chat", "Gpt"].join("") in openResult).toBe(false);
  });
});
