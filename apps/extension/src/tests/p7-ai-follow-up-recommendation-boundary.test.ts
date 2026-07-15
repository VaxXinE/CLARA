import { describe, expect, it } from "vitest";
import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";
import { extensionBackground } from "../background";

describe("P7 AI follow-up recommendation extension boundary", () => {
  it("keeps follow-up recommendations as manual preview assistance", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
    expect(["auto", "submit"].join("-") in extensionBackground).toBe(false);
    expect(["auto", "send"].join("-") in extensionBackground).toBe(false);
  });

  it("does not include cookies, tokens, raw DOM, or raw HTML in safe context", () => {
    const context = buildChatGptSafeContext({
      provider: "extension",
      official_api: false,
      channel: "whatsapp",
      captured_at: "2026-07-14T00:00:00.000Z",
      snapshot_hash: "p7_follow_up_hash",
      chat_title: "Customer",
      messages: [
        {
          id: "m1",
          direction: "incoming",
          text: "Can you remind me later?",
        },
      ],
    });

    expect(context).toContain("operator assistance only");
    expect(context).not.toContain("access_token");
    expect(context).not.toContain("refresh_token");
    expect(context).not.toContain("cookie");
    expect(context).not.toContain("raw DOM");
    expect(context).not.toContain("raw HTML");
  });
});
