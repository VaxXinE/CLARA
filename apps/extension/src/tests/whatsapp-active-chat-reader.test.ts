import { describe, expect, it } from "vitest";
import { WhatsappActiveChatReader } from "../readers/whatsapp-active-chat-reader";

describe("WhatsApp active chat reader", () => {
  it("reads only safe visible active conversation fields from mocked DOM", () => {
    document.body.replaceChildren(
      element("h1", "Budi", { "data-clara-chat-title": "" }),
      element("p", "online", { "data-clara-chat-subtitle": "" }),
      element("div", "Need help", {
        "data-clara-message": "",
        "data-clara-message-id": "m1",
        "data-clara-direction": "incoming",
        "data-clara-author": "Budi",
      }),
      element("div", "We can help", {
        "data-clara-message": "",
        "data-clara-message-id": "m2",
        "data-clara-direction": "outgoing",
        "data-clara-author": "Agent",
      }),
    );

    const result = new WhatsappActiveChatReader(document).read();

    expect(result).toMatchObject({
      channel: "whatsapp",
      chat_title: "Budi",
      chat_subtitle: "online",
      messages: [
        { id: "m1", direction: "incoming", author: "Budi", text: "Need help" },
        {
          id: "m2",
          direction: "outgoing",
          author: "Agent",
          text: "We can help",
        },
      ],
    });
    expect(JSON.stringify(result)).not.toContain(["<", "main", ">"].join(""));
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
