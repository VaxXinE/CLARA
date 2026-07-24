import type {
  ActiveConversationSnapshotDraft,
  ExtensionSnapshotMessage,
} from "../types/extension-snapshot";
import { normalizeSnapshotText } from "../sync/snapshot-normalization";

function textFrom(root: ParentNode, selector: string): string | undefined {
  return normalizeSnapshotText(root.querySelector(selector)?.textContent, 200);
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
        const text = normalizeSnapshotText(element.textContent, 4000);
        const direction =
          element.getAttribute("data-clara-direction") === "outgoing"
            ? "outgoing"
            : "incoming";

        if (!text) return null;

        return {
          id:
            normalizeSnapshotText(
              element.getAttribute("data-clara-message-id") ?? undefined,
              128,
            ) ?? `visible-${index}`,
          direction,
          author: normalizeSnapshotText(
            element.getAttribute("data-clara-author") ?? undefined,
            120,
          ),
          text,
          timestamp_label: normalizeSnapshotText(
            element.getAttribute("data-clara-timestamp") ?? undefined,
            120,
          ),
          reply_context_text: normalizeSnapshotText(
            element.getAttribute("data-clara-reply-context") ?? undefined,
            500,
          ),
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
