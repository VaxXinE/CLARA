import type { ExtensionConfig } from "../config/extension-config";
import { defaultExtensionConfig } from "../config/extension-config";
import type {
  ActiveConversationSnapshotDraft,
  ExtensionSnapshotMessageDirection,
  ExtensionSnapshotPayload,
} from "../types/extension-snapshot";

export const snapshotTextLimits = {
  messageId: 128,
  author: 120,
  title: 200,
  subtitle: 200,
  timestampLabel: 120,
  replyContext: 500,
  sourceOrigin: 300,
} as const;

const redactedValue = "[redacted]";

const sensitiveTextRules = [
  new RegExp(`\\bBearer\\s+\\S+`, "gi"),
  new RegExp(`${["access", "token"].join("[_ -]?")}\\s*[:=]\\s*\\S+`, "gi"),
  new RegExp(`${["refresh", "token"].join("[_ -]?")}\\s*[:=]\\s*\\S+`, "gi"),
  new RegExp(`${["client", "secret"].join("[_ -]?")}\\s*[:=]\\s*\\S+`, "gi"),
  new RegExp(`${["api", "key"].join("[_ -]?")}\\s*[:=]\\s*\\S+`, "gi"),
  new RegExp(`${["authorization"].join("")}\\s*[:=]\\s*\\S+`, "gi"),
  new RegExp(`${["cookie"].join("")}\\s*[:=]\\s*\\S+`, "gi"),
  /\b(?:\d[ -]*?){13,19}\b/g,
];

export function redactSnapshotText(value: string): string {
  return sensitiveTextRules.reduce(
    (current, rule) => current.replace(rule, redactedValue),
    value,
  );
}

export function normalizeSnapshotText(
  value: string | undefined,
  max: number,
): string | undefined {
  const trimmed = value?.replace(/\s+/g, " ").trim();
  if (!trimmed) return undefined;
  return redactSnapshotText(trimmed).slice(0, max);
}

function normalizeDirection(
  direction: string | undefined,
): ExtensionSnapshotMessageDirection {
  return direction === "outgoing" ? "outgoing" : "incoming";
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
      id:
        normalizeSnapshotText(message.id, snapshotTextLimits.messageId) ??
        "visible-message",
      direction: normalizeDirection(message.direction),
      author: normalizeSnapshotText(message.author, snapshotTextLimits.author),
      text:
        normalizeSnapshotText(message.text, config.maxMessageTextLength) ?? "",
      timestamp_label: normalizeSnapshotText(
        message.timestamp_label,
        snapshotTextLimits.timestampLabel,
      ),
      reply_context_text: normalizeSnapshotText(
        message.reply_context_text,
        snapshotTextLimits.replyContext,
      ),
    }))
    .filter((message) => message.text.length > 0);

  return {
    provider: "extension",
    official_api: false,
    channel: draft.channel,
    captured_at: draft.captured_at,
    snapshot_hash: snapshotHash,
    chat_title:
      normalizeSnapshotText(draft.chat_title, snapshotTextLimits.title) ??
      "Active conversation",
    chat_subtitle: normalizeSnapshotText(
      draft.chat_subtitle,
      snapshotTextLimits.subtitle,
    ),
    source_url_origin: normalizeSnapshotText(
      draft.source_url_origin,
      snapshotTextLimits.sourceOrigin,
    ),
    messages,
  };
}
