import type { ExtensionConfig } from "../config/extension-config";
import { defaultExtensionConfig } from "../config/extension-config";
import type {
  ActiveConversationSnapshotDraft,
  ExtensionSnapshotPayload,
} from "../types/extension-snapshot";

function clean(value: string | undefined, max: number): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

export function normalizeSnapshot(
  draft: ActiveConversationSnapshotDraft,
  snapshotHash: string,
  config: Pick<
    ExtensionConfig,
    "maxMessagesPerSnapshot" | "maxMessageTextLength"
  > = defaultExtensionConfig,
): ExtensionSnapshotPayload {
  const messages = draft.messages
    .slice(0, config.maxMessagesPerSnapshot)
    .map((message) => ({
      id: clean(message.id, 128) ?? "visible-message",
      direction: message.direction,
      author: clean(message.author, 120),
      text: clean(message.text, config.maxMessageTextLength) ?? "",
      timestamp_label: clean(message.timestamp_label, 120),
      reply_context_text: clean(message.reply_context_text, 500),
    }))
    .filter((message) => message.text.length > 0);

  return {
    provider: "extension",
    official_api: false,
    channel: draft.channel,
    captured_at: draft.captured_at,
    snapshot_hash: snapshotHash,
    chat_title: clean(draft.chat_title, 200) ?? "Active conversation",
    chat_subtitle: clean(draft.chat_subtitle, 200),
    source_url_origin: clean(draft.source_url_origin, 300),
    messages,
  };
}
