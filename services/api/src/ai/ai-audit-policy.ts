export const aiAuditEventTypes = [
  "ai_suggestion_requested",
  "ai_suggestion_generated",
  "ai_suggestion_rejected",
  "ai_suggestion_accepted",
  "ai_draft_created",
  "ai_context_built_safe",
  "ai_prompt_injection_flagged",
  "ai_policy_blocked",
  "ai_human_approval_required",
] as const;

export type AiAuditEventType = (typeof aiAuditEventTypes)[number];

const aiAuditMetadataAllowlist = new Set([
  "workspace_id",
  "user_id",
  "conversation_id",
  "customer_id",
  "action_type",
  "model_provider",
  "safe_reason_code",
  "correlation_id",
  "suggestion_type",
]);

export function sanitizeAiAuditMetadata(
  input: Record<string, unknown>,
): Record<string, string | number | boolean | null> {
  const output: Record<string, string | number | boolean | null> = {};

  for (const [key, value] of Object.entries(input)) {
    if (!aiAuditMetadataAllowlist.has(key)) {
      continue;
    }

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    ) {
      output[key] = value;
    }
  }

  return output;
}
