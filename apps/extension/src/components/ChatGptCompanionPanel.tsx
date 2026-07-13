import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";
import { resolveChatGptCompanionUrl } from "../chatgpt/chatgpt-companion-url";
import type { ChatGptCompanionConfig } from "../chatgpt/chatgpt-companion-config";
import type { ExtensionSnapshotPayload } from "../types/extension-snapshot";
import { buildSafeContextPreview } from "./SafeContextPreview";

export type ChatGptCompanionPanelState = {
  title: "ChatGPT Companion";
  preview: string;
  companionUrl: string;
  canCopy: boolean;
  canOpen: boolean;
};

export function buildChatGptCompanionPanel(input: {
  snapshot?: ExtensionSnapshotPayload;
  config?: Partial<ChatGptCompanionConfig>;
}): ChatGptCompanionPanelState {
  const companionUrl = resolveChatGptCompanionUrl(input.config?.companionUrl);

  if (!input.snapshot) {
    return {
      title: "ChatGPT Companion",
      preview: "No active synced conversation snapshot.",
      companionUrl,
      canCopy: false,
      canOpen: true,
    };
  }

  const context = buildChatGptSafeContext(input.snapshot, input.config);

  return {
    title: "ChatGPT Companion",
    preview: buildSafeContextPreview({ context }),
    companionUrl,
    canCopy: true,
    canOpen: true,
  };
}

export async function copyChatGptSafeContext(input: {
  context: string;
  clipboard?: Pick<Clipboard, "writeText">;
}): Promise<{
  ok: boolean;
  reasonCode?: "clipboard_unavailable" | "copy_failed";
}> {
  const clipboard = input.clipboard ?? globalThis.navigator?.clipboard;

  if (!clipboard) return { ok: false, reasonCode: "clipboard_unavailable" };

  try {
    await clipboard.writeText(input.context);
    return { ok: true };
  } catch {
    return { ok: false, reasonCode: "copy_failed" };
  }
}

export function openChatGptCompanion(input: {
  companionUrl?: string;
  openWindow?: (url: string, target: string, features: string) => unknown;
}): { ok: boolean; url: string } {
  const url = resolveChatGptCompanionUrl(input.companionUrl);
  const openWindow = input.openWindow ?? globalThis.window?.open;

  if (!openWindow) return { ok: false, url };

  try {
    openWindow(url, "_blank", "noopener,noreferrer");
    return { ok: true, url };
  } catch {
    return { ok: false, url };
  }
}
