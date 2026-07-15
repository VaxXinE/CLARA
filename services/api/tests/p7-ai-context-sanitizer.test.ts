import { describe, expect, it } from "vitest";
import {
  isAiContextBlockedKey,
  sanitizeAiObject,
  sanitizeAiPlainText,
} from "../src/ai/ai-context-sanitizer";

describe("P7 AI context sanitizer", () => {
  it("strips HTML to plain text", () => {
    expect(
      sanitizeAiPlainText("<p>Hello</p><script>alert(1)</script><b>World</b>"),
    ).toBe("Hello World");
  });

  it("rejects token, cookie, raw payload, DOM, HTML, and provider secret keys", () => {
    expect(isAiContextBlockedKey("access_token")).toBe(true);
    expect(isAiContextBlockedKey("refresh_token")).toBe(true);
    expect(isAiContextBlockedKey("providerCookie")).toBe(true);
    expect(isAiContextBlockedKey("sessionCookie")).toBe(true);
    expect(isAiContextBlockedKey("rawProviderPayload")).toBe(true);
    expect(isAiContextBlockedKey("raw_provider_payload")).toBe(true);
    expect(isAiContextBlockedKey("rawWebhookPayload")).toBe(true);
    expect(isAiContextBlockedKey("raw_webhook_payload")).toBe(true);
    expect(isAiContextBlockedKey("rawDom")).toBe(true);
    expect(isAiContextBlockedKey("rawHtml")).toBe(true);
    expect(isAiContextBlockedKey("serviceRoleKey")).toBe(true);
  });

  it("keeps only safe primitive fields", () => {
    const sanitized = sanitizeAiObject({
      safe_channel_status: "connected",
      access_token: "atk",
      refresh_token: "rtk",
      rawProviderPayload: "{unsafe}",
      nested: { unsafe: true },
    });
    const serialized = JSON.stringify(sanitized);

    expect(sanitized).toEqual({ safe_channel_status: "connected" });
    expect(serialized).not.toContain("atk");
    expect(serialized).not.toContain("rtk");
    expect(serialized).not.toContain("unsafe");
  });
});
