export function resolveAiRequestTimeoutMs(value: number): number {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error("Invalid AI timeout policy.");
  }

  return value;
}
