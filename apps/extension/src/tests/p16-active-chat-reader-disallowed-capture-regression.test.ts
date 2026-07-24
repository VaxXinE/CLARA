import { describe, expect, it } from "vitest";
import { InstagramActiveChatReader } from "../readers/instagram-active-chat-reader";
import { TiktokActiveChatReader } from "../readers/tiktok-active-chat-reader";
import { WhatsappActiveChatReader } from "../readers/whatsapp-active-chat-reader";

describe("P16 active chat reader disallowed capture regression", () => {
  it("does not expose cookie, token, auth header, storage, raw DOM, raw HTML, full page, or hidden inbox capture methods", () => {
    const methods = [
      ...Object.getOwnPropertyNames(WhatsappActiveChatReader.prototype),
      ...Object.getOwnPropertyNames(InstagramActiveChatReader.prototype),
      ...Object.getOwnPropertyNames(TiktokActiveChatReader.prototype),
    ];

    expect(methods).not.toContain("readCookies");
    expect(methods).not.toContain("readSessionToken");
    expect(methods).not.toContain("captureAuthHeaders");
    expect(methods).not.toContain("readLocalStorage");
    expect(methods).not.toContain("readSessionStorage");
    expect(methods).not.toContain("captureRawDom");
    expect(methods).not.toContain("captureRawHtml");
    expect(methods).not.toContain("dumpFullPage");
    expect(methods).not.toContain("crawlInbox");
    expect(methods).not.toContain("massScrapeConversations");
  });
});
