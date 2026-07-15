import { describe, expect, it } from "vitest";
import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";
import { extensionBackground } from "../background";

describe("P7 AI context boundary regression", () => {
  it("keeps extension context preview/copy/manual without raw browser state", () => {
    const context = buildChatGptSafeContext({
      provider: "extension",
      official_api: false,
      channel: "whatsapp",
      captured_at: "2026-07-14T00:00:00.000Z",
      snapshot_hash: "safe_hash",
      chat_title: "Customer",
      messages: [{ id: "m1", direction: "incoming", text: "Need help" }],
    });

    expect(extensionBackground.sendMode).toBe("manual_assisted");
    expect(context).toContain("human operator explicitly reviews");
    expect(context).not.toContain("access_token");
    expect(context).not.toContain("refresh_token");
    expect(context).not.toContain("cookies");
    expect(context).not.toContain("raw DOM");
    expect(context).not.toContain("raw HTML");
    expect(context).not.toContain("auto-send");
  });
});
