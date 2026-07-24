import { describe, expect, it } from "vitest";
import { InstagramActiveChatReader } from "../readers/instagram-active-chat-reader";

describe("P16 Instagram active chat reader hardening", () => {
  it("returns a safe normalized active-chat snapshot from visible operator-opened chat", () => {
    document.body.replaceChildren(
      element("h1", "  IG   Lead  ", { "data-clara-chat-title": "" }),
      element("div", "Need product info", {
        "data-clara-message": "",
        "data-clara-message-id": "ig-1",
        "data-clara-direction": "incoming",
      }),
    );

    const snapshot = new InstagramActiveChatReader(document).read();

    expect(snapshot).toMatchObject({
      channel: "instagram",
      chat_title: "IG Lead",
      messages: [
        {
          id: "ig-1",
          direction: "incoming",
          text: "Need product info",
        },
      ],
    });
    expect(JSON.stringify(snapshot)).not.toContain("cookie");
    expect(JSON.stringify(snapshot)).not.toContain("<script");
  });

  it("fails closed instead of reading inbox/background conversations", () => {
    document.body.replaceChildren(
      element("div", "Hidden inbox thread", { "data-clara-inbox-row": "" }),
    );

    expect(new InstagramActiveChatReader(document).read()).toBeNull();
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
