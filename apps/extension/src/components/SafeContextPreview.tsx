export function buildSafeContextPreview(input: {
  context: string;
  maxLength?: number;
}): string {
  const maxLength = input.maxLength ?? 1200;

  if (input.context.length <= maxLength) return input.context;

  return `${input.context.slice(0, Math.max(0, maxLength - 12)).trimEnd()} [truncated]`;
}
