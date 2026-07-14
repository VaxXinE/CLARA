import { describe, expect, it } from "vitest";
import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";
import { extensionBackground } from "../background";

describe("P7 AI extension boundary regression", () => {
  it("keeps extension AI context preview/copy/manual only", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
  });

  it("does not include provider secrets or raw page data in AI context", () => {
    const context = buildChatGptSafeContext({
      provider: "extension",
      official_api: false,
      channel: "whatsapp",
      captured_at: "2026-07-14T00:00:00.000Z",
      snapshot_hash: "p7_hash",
      chat_title: "Customer",
      messages: [{ id: "m1", direction: "incoming", text: "Need help" }],
    });

    expect(context).toContain("human operator explicitly reviews");
    expect(context).not.toContain("access_token");
    expect(context).not.toContain("refresh_token");
    expect(context).not.toContain("raw DOM");
    expect(context).not.toContain("raw HTML");
    expect(context).not.toContain("auto-send");
  });
});
