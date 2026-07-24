import { describe, expect, it } from "vitest";
import { TiktokActiveChatReader } from "../readers/tiktok-active-chat-reader";

describe("P16 TikTok active chat reader hardening", () => {
  it("returns a safe normalized active-chat snapshot from visible operator-opened chat", () => {
    document.body.replaceChildren(
      element("h1", "  TikTok   Buyer  ", { "data-clara-chat-title": "" }),
      element("div", "Can you ship today?", {
        "data-clara-message": "",
        "data-clara-message-id": "tt-1",
        "data-clara-direction": "incoming",
      }),
    );

    const snapshot = new TiktokActiveChatReader(document).read();

    expect(snapshot).toMatchObject({
      channel: "tiktok",
      chat_title: "TikTok Buyer",
      messages: [
        {
          id: "tt-1",
          direction: "incoming",
          text: "Can you ship today?",
        },
      ],
    });
    expect(JSON.stringify(snapshot)).not.toContain("sessionStorage");
    expect(JSON.stringify(snapshot)).not.toContain("outerHTML");
  });

  it("fails closed instead of mass scraping conversation lists", () => {
    document.body.replaceChildren(
      element("div", "Thread A", { "data-clara-conversation-list-item": "" }),
    );

    expect(new TiktokActiveChatReader(document).read()).toBeNull();
  });
});

function element(
  tagName: string,
  text: string,
  attributes: Record<string, string>,
): HTMLElement {
  const node = document.createElement(tagName);
  node.textContent = text;

  for (const [name, value] of Object.entries(attributes)) {
    node.setAttribute(name, value);
  }

  return node;
}
