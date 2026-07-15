import { describe, expect, it } from "vitest";
import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";

describe("P7 final AI companion boundary regression", () => {
  it("keeps ChatGPT companion preview, copy, and manual only", () => {
    const context = buildChatGptSafeContext({
      provider: "extension",
      official_api: false,
      channel: "instagram",
      captured_at: "2026-07-15T00:00:00.000Z",
      snapshot_hash: "p7_final_companion_hash",
      chat_title: "Customer",
      messages: [{ id: "m1", direction: "incoming", text: "Need help" }],
    });

    expect(context).toContain("operator assistance only");
    expect(context).toContain("human operator explicitly reviews");
    expect(context).not.toContain("auto-submit");
    expect(context).not.toContain("auto-send");
    expect(context).not.toContain("CLARA_SECRET");
    expect(context).not.toContain("Authorization");
  });
});
