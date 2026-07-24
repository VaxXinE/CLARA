import { describe, expect, it } from "vitest";
import { AutoSyncEngine } from "../sync/auto-sync-engine";
import { InstagramActiveChatReader } from "../readers/instagram-active-chat-reader";
import { TiktokActiveChatReader } from "../readers/tiktok-active-chat-reader";
import { WhatsappActiveChatReader } from "../readers/whatsapp-active-chat-reader";

describe("P16 active chat reader no auto-send regression", () => {
  it("does not add reply send or submit powers to readers or sync engine", () => {
    const methods = [
      ...Object.getOwnPropertyNames(WhatsappActiveChatReader.prototype),
      ...Object.getOwnPropertyNames(InstagramActiveChatReader.prototype),
      ...Object.getOwnPropertyNames(TiktokActiveChatReader.prototype),
      ...Object.getOwnPropertyNames(AutoSyncEngine.prototype),
    ];

    expect(methods).not.toContain("autoSend");
    expect(methods).not.toContain("sendReply");
    expect(methods).not.toContain("clickSend");
    expect(methods).not.toContain("submitReply");
  });
});
