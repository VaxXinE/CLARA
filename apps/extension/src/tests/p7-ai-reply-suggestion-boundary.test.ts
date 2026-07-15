import { describe, expect, it } from "vitest";
import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";
import { extensionBackground } from "../background";

describe("P7 AI reply suggestion extension boundary", () => {
  it("keeps ChatGPT companion as preview, copy, and manual operator assistance", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
    expect(
      ["submit", "To", "Chat", "Gpt"].join("") in extensionBackground,
    ).toBe(false);
  });

  it("does not include browser secrets, raw page content, or customer send automation in copied context", () => {
    const context = buildChatGptSafeContext({
      provider: "extension",
      official_api: false,
      channel: "whatsapp",
      captured_at: "2026-07-14T00:00:00.000Z",
      snapshot_hash: "p7_reply_suggestion_hash",
      chat_title: "Customer",
      messages: [
        {
          id: "m1",
          direction: "incoming",
          text: "Please suggest a response.",
        },
      ],
    });

    expect(context).toContain("Suggest a concise, helpful reply.");
    expect(context).not.toContain("access_token");
    expect(context).not.toContain("refresh_token");
    expect(context).not.toContain("cookie");
    expect(context).not.toContain("raw DOM");
    expect(context).not.toContain("raw HTML");
    expect(context).not.toContain("auto-submit");
  });
});
