export function toSafeProposalText(value: string | undefined): string | null {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.length > 240 ? `${trimmed.slice(0, 237)}...` : trimmed;
}

export function toSafePayloadSummary(
  payload: Record<string, unknown> | undefined,
): string {
  if (!payload) {
    return "No suggested payload was provided.";
  }

  const keys = Object.entries(payload)
    .filter(([, value]) =>
      ["string", "number", "boolean"].includes(typeof value),
    )
    .map(([key]) => key)
    .slice(0, 8);

  return keys.length > 0
    ? `Safe suggested fields: ${keys.join(", ")}.`
    : "Suggested payload did not include safe primitive fields.";
}
