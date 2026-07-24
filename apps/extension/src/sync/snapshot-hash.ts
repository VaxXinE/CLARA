import type { ActiveConversationSnapshotDraft } from "../types/extension-snapshot";
import { normalizeSnapshotText } from "./snapshot-normalization";

function stableSnapshotString(
  snapshot: ActiveConversationSnapshotDraft,
): string {
  return JSON.stringify({
    channel: snapshot.channel,
    chat_title: normalizeSnapshotText(snapshot.chat_title, 200) ?? "",
    chat_subtitle: normalizeSnapshotText(snapshot.chat_subtitle, 200) ?? "",
    messages: snapshot.messages.map((message) => ({
      id: normalizeSnapshotText(message.id, 128) ?? "",
      direction: message.direction === "outgoing" ? "outgoing" : "incoming",
      text: normalizeSnapshotText(message.text, 4000) ?? "",
    })),
  });
}

function fallbackHash(input: string): string {
  let hash = 5381;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33) ^ input.charCodeAt(index);
  }

  return `snapshot_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export async function createSnapshotHash(
  snapshot: ActiveConversationSnapshotDraft,
): Promise<string> {
  const input = stableSnapshotString(snapshot);
  const subtle = globalThis.crypto?.subtle;

  if (!subtle) return fallbackHash(input);

  const bytes = await subtle.digest("SHA-256", new TextEncoder().encode(input));
  return `snapshot_${[...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")}`;
}
