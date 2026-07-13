import type { ExtensionChannel } from "./channel";

export type ExtensionSnapshotMessageDirection = "incoming" | "outgoing";

export type ExtensionSnapshotMessage = {
  id: string;
  direction: ExtensionSnapshotMessageDirection;
  author?: string;
  text: string;
  timestamp_label?: string;
  reply_context_text?: string;
};

export type ExtensionSnapshotPayload = {
  provider: "extension";
  official_api: false;
  channel: ExtensionChannel;
  captured_at: string;
  snapshot_hash: string;
  chat_title: string;
  chat_subtitle?: string;
  source_url_origin?: string;
  messages: ExtensionSnapshotMessage[];
};

export type ActiveConversationSnapshotDraft = Omit<
  ExtensionSnapshotPayload,
  "provider" | "official_api" | "snapshot_hash"
>;
