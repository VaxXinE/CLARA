export type ExtensionBridgeChannel = "whatsapp" | "instagram" | "tiktok";

export type ExtensionBridgeProvider = "extension";

export type ExtensionBridgeAutomationLevel = "active_conversation_auto_sync";

export type ExtensionBridgeSendMode = "manual_assisted";

export type ExtensionBridgeMessageDirection = "incoming" | "outgoing";

export type ExtensionBridgeMessageSnapshot = {
  id: string;
  direction: ExtensionBridgeMessageDirection;
  author?: string;
  text: string;
  timestamp_label?: string;
  reply_context_text?: string;
};

export type ExtensionBridgeSnapshotPayload = {
  provider: ExtensionBridgeProvider;
  official_api: false;
  channel: ExtensionBridgeChannel;
  captured_at: string;
  snapshot_hash: string;
  chat_title: string;
  chat_subtitle?: string;
  source_url_origin?: string;
  messages: ExtensionBridgeMessageSnapshot[];
  debug?: Record<string, string | number | boolean | null>;
};

export type ExtensionBridgeReplySuggestionRequest = {
  provider: ExtensionBridgeProvider;
  official_api: false;
  channel: ExtensionBridgeChannel;
  snapshot_hash: string;
  operator_instruction?: string;
};

export type ExtensionBridgeManualSendConfirmation = {
  provider: ExtensionBridgeProvider;
  official_api: false;
  channel: ExtensionBridgeChannel;
  snapshot_hash: string;
  sent_at: string;
  confirmation_hash: string;
};
