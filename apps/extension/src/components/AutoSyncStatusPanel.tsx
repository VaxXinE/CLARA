import type { AutoSyncStatus } from "../sync/auto-sync-engine";
import type { ExtensionChannel } from "../types/channel";

export function buildAutoSyncStatusPanel(input: {
  channel: ExtensionChannel | "unsupported";
  chatTitle?: string;
  status: AutoSyncStatus;
}): string {
  return [
    `Channel: ${input.channel}`,
    `Chat: ${input.chatTitle ?? "No active chat"}`,
    `Auto-sync: ${input.status.enabled ? "ON" : "OFF"}`,
    `Last status: ${input.status.lastStatus}`,
    `Last sync: ${input.status.lastSyncAt ?? "Never"}`,
    `Message count: ${input.status.messageCount}`,
    input.status.errorMessage ? `Error: ${input.status.errorMessage}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
