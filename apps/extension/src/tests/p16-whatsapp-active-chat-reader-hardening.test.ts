import { describe, expect, it } from "vitest";
import { WhatsappActiveChatReader } from "../readers/whatsapp-active-chat-reader";

describe("P16 WhatsApp active chat reader hardening", () => {
  it("returns a safe normalized active-chat snapshot from visible operator-opened chat", () => {
    document.body.replaceChildren(
      element("h1", "  Budi   Customer  ", { "data-clara-chat-title": "" }),
      element("p", " online now ", { "data-clara-chat-subtitle": "" }),
      element("div", " Halo   CLARA ", {
        "data-clara-message": "",
        "data-clara-message-id": " wa-1 ",
        "data-clara-direction": "incoming",
        "data-clara-author": " Budi ",
        "data-clara-timestamp": " Today 10:00 ",
      }),
    );

    const snapshot = new WhatsappActiveChatReader(document).read();

    expect(snapshot).toMatchObject({
      channel: "whatsapp",
      chat_title: "Budi Customer",
      chat_subtitle: "online now",
      messages: [
        {
          id: "wa-1",
          direction: "incoming",
          author: "Budi",
          text: "Halo CLARA",
          timestamp_label: "Today 10:00",
        },
      ],
    });
    expect(JSON.stringify(snapshot)).not.toContain("<div");
    expect(JSON.stringify(snapshot)).not.toContain("localStorage");
  });

  it("fails closed when no active chat or visible message exists", () => {
    document.body.replaceChildren(element("h1", "Inbox", {}));

    expect(new WhatsappActiveChatReader(document).read()).toBeNull();
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
