import { describe, expect, it } from "vitest";
import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";
import type { ExtensionSnapshotPayload } from "../types/extension-snapshot";

const snapshot: ExtensionSnapshotPayload = {
  provider: "extension",
  official_api: false,
  channel: "whatsapp",
  captured_at: "2026-07-13T00:00:00.000Z",
  snapshot_hash: "hash_demo",
  chat_title: "Budi",
  chat_subtitle: "online",
  messages: [
    { id: "m1", direction: "incoming", author: "Budi", text: "Need help" },
    { id: "m2", direction: "outgoing", author: "Agent", text: "We can help" },
    { id: "m3", direction: "incoming", author: "Budi", text: "Thanks" },
  ],
};

describe("ChatGPT safe context builder", () => {
  it("builds bounded plain-text context from normalized snapshot", () => {
    const context = buildChatGptSafeContext(snapshot, {
      messageLimit: 2,
      messageTextLimit: 20,
      promptLengthLimit: 1000,
    });

    expect(context).toContain("channel: whatsapp");
    expect(context).toContain("provider: extension");
    expect(context).toContain("official_api: false");
    expect(context).toContain("[outgoing Agent] We can help");
    expect(context).toContain("[incoming Budi] Thanks");
    expect(context).not.toContain("Need help");
  });

  it("truncates message and total prompt length", () => {
    const context = buildChatGptSafeContext(
      {
        ...snapshot,
        messages: [
          {
            id: "m4",
            direction: "incoming",
            text: "A".repeat(200),
          },
        ],
      },
      { messageTextLimit: 24, promptLengthLimit: 260 },
    );

    expect(context.length).toBeLessThanOrEqual(260);
    expect(context).toContain("[truncated]");
  });

  it("ignores unsafe non-contract fields", () => {
    const unsafe = {
      ...snapshot,
      rawDom: "<main>unsafe</main>",
      rawHtml: "<script>bad()</script>",
      [["_", "token"].join("")]: "secret",
      [["Authori", "zation"].join("")]: "blocked-value",
    } as ExtensionSnapshotPayload;

    const context = buildChatGptSafeContext(unsafe);

    expect(context).not.toContain("<main>");
    expect(context).not.toContain("<script>");
    expect(context).not.toContain("blocked-value");
    expect(context).not.toContain("secret");
  });
});
