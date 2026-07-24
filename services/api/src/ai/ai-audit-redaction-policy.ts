import { sanitizeAiAuditMetadata } from "./ai-audit-policy";

export function sanitizeAiProviderAuditMetadata(
  input: Record<string, unknown>,
): Record<string, string | number | boolean | null> {
  return sanitizeAiAuditMetadata(input);
}
