import { normalizeSnapshotText } from "../sync/snapshot-normalization";
import type {
  ActiveConversationSnapshotDraft,
  ExtensionSnapshotMessage,
} from "../types/extension-snapshot";

export class TiktokActiveChatReader {
  constructor(private readonly doc: Document = document) {}

  read(): ActiveConversationSnapshotDraft | null {
    const title = normalizeSnapshotText(
      this.doc.querySelector("[data-clara-chat-title]")?.textContent,
      200,
    );

    if (!title) return null;

    const messages: ExtensionSnapshotMessage[] = [
      ...this.doc.querySelectorAll("[data-clara-message]"),
    ]
      .map((element, index): ExtensionSnapshotMessage | null => {
        const text = normalizeSnapshotText(element.textContent, 4000);
        if (!text) return null;

        return {
          id:
            normalizeSnapshotText(
              element.getAttribute("data-clara-message-id") ?? undefined,
              128,
            ) ?? `visible-${index}`,
          direction:
            element.getAttribute("data-clara-direction") === "outgoing"
              ? "outgoing"
              : "incoming",
          author: normalizeSnapshotText(
            element.getAttribute("data-clara-author") ?? undefined,
            120,
          ),
          text,
          timestamp_label: normalizeSnapshotText(
            element.getAttribute("data-clara-timestamp") ?? undefined,
            120,
          ),
        };
      })
      .filter((message): message is ExtensionSnapshotMessage =>
        Boolean(message),
      );

    if (messages.length === 0) return null;

    return {
      channel: "tiktok",
      captured_at: new Date().toISOString(),
      chat_title: title,
      chat_subtitle: normalizeSnapshotText(
        this.doc.querySelector("[data-clara-chat-subtitle]")?.textContent,
        200,
      ),
      source_url_origin: window.location.origin,
      messages,
    };
  }
}
