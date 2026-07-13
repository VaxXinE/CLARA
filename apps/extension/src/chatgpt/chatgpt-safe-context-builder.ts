import { defaultChatGptCompanionConfig } from "./chatgpt-companion-config";
import type { ChatGptSafeContextBuildOptions } from "./chatgpt-safe-context-types";
import type { ExtensionSnapshotPayload } from "../types/extension-snapshot";

export function buildChatGptSafeContext(
  snapshot: ExtensionSnapshotPayload,
  config: ChatGptSafeContextBuildOptions = {},
): string {
  const limits = { ...defaultChatGptCompanionConfig, ...config };
  const lines = [
    "CLARA ChatGPT Companion Context",
    "",
    "Use this as operator assistance only. Do not send anything to the customer unless the human operator explicitly reviews and sends it.",
    "",
    `channel: ${snapshot.channel}`,
    `provider: ${snapshot.provider}`,
    `official_api: ${String(snapshot.official_api)}`,
    `chat_title: ${bounded(snapshot.chat_title, limits.messageTextLimit)}`,
    snapshot.chat_subtitle
      ? `chat_subtitle: ${bounded(snapshot.chat_subtitle, limits.messageTextLimit)}`
      : "",
    "",
    "Recent visible messages:",
    ...snapshot.messages.slice(-limits.messageLimit).map((message, index) => {
      const author = message.author ? ` ${bounded(message.author, 80)}` : "";
      return `${index + 1}. [${message.direction}${author}] ${bounded(message.text, limits.messageTextLimit)}`;
    }),
    "",
    "Instruction:",
    "Suggest a concise, helpful reply. Preserve facts from the conversation. Ask for missing information instead of guessing.",
  ].filter(Boolean);

  return bounded(lines.join("\n"), limits.promptLengthLimit);
}

function bounded(value: string, maxLength: number): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 12)).trimEnd()} [truncated]`;
}
