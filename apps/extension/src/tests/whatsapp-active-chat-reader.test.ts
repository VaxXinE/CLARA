import { describe, expect, it } from "vitest";
import { WhatsappActiveChatReader } from "../readers/whatsapp-active-chat-reader";

describe("WhatsApp active chat reader", () => {
  it("reads only safe visible active conversation fields from mocked DOM", () => {
    document.body.innerHTML = `
      <main>
        <h1 data-clara-chat-title>Budi</h1>
        <p data-clara-chat-subtitle>online</p>
        <div data-clara-message data-clara-message-id="m1" data-clara-direction="incoming" data-clara-author="Budi">Need help</div>
        <div data-clara-message data-clara-message-id="m2" data-clara-direction="outgoing" data-clara-author="Agent">We can help</div>
      </main>
    `;

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
    expect(JSON.stringify(result)).not.toContain("<main>");
  });
});
