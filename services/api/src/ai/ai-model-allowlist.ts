export function isAiModelAllowed(input: {
  model: string;
  allowlist: string[];
}): boolean {
  return input.allowlist.includes(input.model);
}
