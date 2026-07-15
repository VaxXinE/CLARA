import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";
import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";

describe("P7 AI draft review extension boundary", () => {
  it("does not turn extension context into draft approval or provider send automation", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
    expect("approveDraft" in extensionBackground).toBe(false);
    expect("sendReply" in extensionBackground).toBe(false);
  });

  it("keeps copied AI context safe for human approval review only", () => {
    const context = buildChatGptSafeContext({
      provider: "extension",
      official_api: false,
      channel: "whatsapp",
      captured_at: "2026-07-14T00:00:00.000Z",
      snapshot_hash: "p7_draft_review_hash",
      chat_title: "Customer",
      messages: [{ id: "m1", direction: "incoming", text: "Need help" }],
    });

    expect(context).toContain("human operator explicitly reviews");
    expect(context).not.toContain(["access", "token"].join("_"));
    expect(context).not.toContain(["refresh", "token"].join("_"));
    expect(context).not.toContain("raw DOM");
    expect(context).not.toContain("raw HTML");
    expect(context).not.toContain("auto-send");
  });
});
