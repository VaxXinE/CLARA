import type { ActiveConversationSnapshotDraft } from "../types/extension-snapshot";

function stableSnapshotString(
  snapshot: ActiveConversationSnapshotDraft,
): string {
  return JSON.stringify({
    channel: snapshot.channel,
    chat_title: snapshot.chat_title,
    chat_subtitle: snapshot.chat_subtitle ?? "",
    messages: snapshot.messages.map((message) => ({
      id: message.id,
      direction: message.direction,
      text: message.text,
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
