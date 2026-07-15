import { describe, expect, it } from "vitest";
import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";
import { extensionBackground } from "../background";

describe("P7 AI automation guardrail extension boundary", () => {
  it("keeps companion actions manual and preview-only", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
    expect(["auto", "submit"].join("-") in extensionBackground).toBe(false);
    expect(["auto", "send"].join("-") in extensionBackground).toBe(false);
    expect(["auto", "writeCustomerNote"].join("-") in extensionBackground).toBe(
      false,
    );
    expect(
      ["browser", "automation", "provider", "session"].join("_") in
        extensionBackground,
    ).toBe(false);
  });

  it("does not expose cookies, tokens, or raw browser/provider material", () => {
    const context = buildChatGptSafeContext({
      provider: "extension",
      official_api: false,
      channel: "instagram",
      captured_at: "2026-07-15T00:00:00.000Z",
      snapshot_hash: "p7_automation_guardrail_hash",
      chat_title: "Customer",
      messages: [
        {
          id: "m1",
          direction: "incoming",
          text: "Please help me write a reply.",
        },
      ],
    });

    expect(context).toContain("operator assistance only");
    expect(context).not.toContain("access_token");
    expect(context).not.toContain("refresh_token");
    expect(context).not.toContain("Authorization");
    expect(context).not.toContain("cookie");
    expect(context).not.toContain("raw provider payload");
    expect(context).not.toContain("raw DOM");
    expect(context).not.toContain("raw HTML");
  });
});
