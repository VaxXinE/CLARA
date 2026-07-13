import type {
  ActiveConversationSnapshotDraft,
  ExtensionSnapshotMessage,
} from "../types/extension-snapshot";

function textFrom(root: ParentNode, selector: string): string | undefined {
  const value = root.querySelector(selector)?.textContent?.trim();
  return value && value.length > 0 ? value : undefined;
}

export class WhatsappActiveChatReader {
  constructor(private readonly doc: Document = document) {}

  read(): ActiveConversationSnapshotDraft | null {
    const title = textFrom(this.doc, "[data-clara-chat-title]");

    if (!title) return null;

    const messages: ExtensionSnapshotMessage[] = [
      ...this.doc.querySelectorAll("[data-clara-message]"),
    ]
      .map((element, index): ExtensionSnapshotMessage | null => {
        const text = element.textContent?.trim();
        const direction =
          element.getAttribute("data-clara-direction") === "outgoing"
            ? "outgoing"
            : "incoming";

        if (!text) return null;

        return {
          id:
            element.getAttribute("data-clara-message-id") ?? `visible-${index}`,
          direction,
          author: element.getAttribute("data-clara-author") ?? undefined,
          text,
          timestamp_label:
            element.getAttribute("data-clara-timestamp") ?? undefined,
          reply_context_text:
            element.getAttribute("data-clara-reply-context") ?? undefined,
        };
      })
      .filter((message): message is ExtensionSnapshotMessage =>
        Boolean(message),
      );

    if (messages.length === 0) return null;

    return {
      channel: "whatsapp",
      captured_at: new Date().toISOString(),
      chat_title: title,
      chat_subtitle: textFrom(this.doc, "[data-clara-chat-subtitle]"),
      source_url_origin: window.location.origin,
      messages,
    };
  }
}
