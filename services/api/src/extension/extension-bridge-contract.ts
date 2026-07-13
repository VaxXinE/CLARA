import type { ExtensionBridgeChannel } from "./extension-bridge-types";

export const extensionBridgeProvider = "extension" as const;
export const extensionBridgeOfficialApi = false as const;
export const extensionBridgeAutomationLevel =
  "active_conversation_auto_sync" as const;
export const extensionBridgeSendMode = "manual_assisted" as const;

export const extensionBridgeChannels = [
  "whatsapp",
  "instagram",
  "tiktok",
] as const satisfies readonly ExtensionBridgeChannel[];

export const extensionBridgeRoutes = {
  snapshots: "/api/v1/extension/:channel/snapshots",
  replySuggestions: "/api/v1/extension/:channel/reply-suggestions",
  manualSendConfirmations:
    "/api/v1/extension/:channel/manual-send-confirmations",
} as const;

export const extensionBridgeLimits = {
  maxMessagesPerSnapshot: 50,
  maxMessageTextLength: 4_000,
  minSnapshotHashLength: 12,
  maxChatTitleLength: 200,
  maxDebugMetadataKeys: 20,
} as const;

export function isExtensionBridgeChannel(
  value: string,
): value is ExtensionBridgeChannel {
  return (extensionBridgeChannels as readonly string[]).includes(value);
}
