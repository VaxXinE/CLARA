const allowedPayloadKeys = new Set([
  "priority",
  "reason",
  "dueWindow",
  "channel",
  "source",
]);

export function toSafeFollowUpText(value: string | undefined): string | null {
  const text = value?.replace(/\s+/g, " ").trim();

  if (!text) {
    return null;
  }

  return text.slice(0, 240);
}

export function toSafeFollowUpPayloadSummary(
  payload: Record<string, unknown> | undefined,
): string | null {
  if (!payload) {
    return null;
  }

  const pairs = Object.entries(payload)
    .filter(([key]) => allowedPayloadKeys.has(key))
    .map(([key, value]) => `${key}=${String(value).slice(0, 80)}`);

  return pairs.length > 0 ? `Safe payload: ${pairs.join(", ")}.` : null;
}
