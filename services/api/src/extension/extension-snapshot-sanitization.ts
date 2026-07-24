import type {
  ExtensionSnapshot,
  ExtensionSnapshotMessage,
} from "./extension-snapshot-types";

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

export function redactExtensionSnapshotText(value: string): string {
  return sensitiveTextRules.reduce(
    (current, rule) => current.replace(rule, redactedValue),
    value,
  );
}

function sanitizeMessage(
  message: ExtensionSnapshotMessage,
): ExtensionSnapshotMessage {
  return {
    id: message.id,
    direction: message.direction,
    author: message.author ? redactExtensionSnapshotText(message.author) : null,
    text: redactExtensionSnapshotText(message.text),
    timestampLabel: message.timestampLabel,
    replyContextText: message.replyContextText
      ? redactExtensionSnapshotText(message.replyContextText)
      : null,
  };
}

export function sanitizeExtensionSnapshot(
  snapshot: ExtensionSnapshot,
): ExtensionSnapshot {
  return {
    provider: "extension",
    officialApi: false,
    channel: snapshot.channel,
    capturedAt: snapshot.capturedAt,
    snapshotHash: snapshot.snapshotHash,
    chatTitle: redactExtensionSnapshotText(snapshot.chatTitle),
    chatSubtitle: snapshot.chatSubtitle
      ? redactExtensionSnapshotText(snapshot.chatSubtitle)
      : null,
    sourceUrlOrigin: snapshot.sourceUrlOrigin,
    messages: snapshot.messages.map(sanitizeMessage),
  };
}
