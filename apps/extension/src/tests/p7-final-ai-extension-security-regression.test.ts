import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";
import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";

describe("P7 final AI extension security regression", () => {
  it("keeps AI context free of cookies, tokens, raw DOM, and raw HTML", () => {
    const context = buildChatGptSafeContext({
      provider: "extension",
      official_api: false,
      channel: "whatsapp",
      captured_at: "2026-07-15T00:00:00.000Z",
      snapshot_hash: "p7_final_ai_hash",
      chat_title: "Customer",
      messages: [{ id: "m1", direction: "incoming", text: "Need help" }],
    });

    expect(context).not.toContain("access_token");
    expect(context).not.toContain("refresh_token");
    expect(context).not.toContain("cookie");
    expect(context).not.toContain("raw DOM");
    expect(context).not.toContain("raw HTML");
  });

  it("does not add provider session automation or auto-write behavior", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
    expect(
      ["browser", "automation", "provider", "session"].join("_") in
        extensionBackground,
    ).toBe(false);
    expect(["auto", "submit"].join("-") in extensionBackground).toBe(false);
    expect(["auto", "send"].join("-") in extensionBackground).toBe(false);
    expect(["auto", "writeCustomerNote"].join("-") in extensionBackground).toBe(
      false,
    );
  });
});
