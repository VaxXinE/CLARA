import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";
import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";

describe("P6 final extension security regression", () => {
  it("keeps extension bridge active-visible-chat and manual-assisted only", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
  });

  it("does not turn ChatGPT companion into auto-submit or auto-send", () => {
    const context = buildChatGptSafeContext({
      provider: "extension",
      official_api: false,
      channel: "whatsapp",
      captured_at: "2026-07-14T00:00:00.000Z",
      snapshot_hash: "p6_final_hash",
      chat_title: "Customer",
      messages: [{ id: "m1", direction: "incoming", text: "Need help" }],
    });

    expect(context).toContain("human operator explicitly reviews");
    expect(context).not.toContain("access_token");
    expect(context).not.toContain("refresh_token");
    expect(context).not.toContain("auto-send");
  });
});
