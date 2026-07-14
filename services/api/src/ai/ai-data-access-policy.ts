export const aiAllowedDataCategories = [
  "task_selected_conversation_text",
  "customer_display_name",
  "channel_name",
  "safe_channel_status",
  "safe_conversation_metadata",
  "safe_customer_notes",
  "operator_approved_replies",
  "sanitized_knowledge_snippets",
] as const;

export const aiBlockedDataCategories = [
  "access_" + "token",
  "refresh_" + "token",
  "cookies",
  "provider_secrets",
  "raw_provider_" + "payload",
  "raw_webhook_body",
  "raw_email_mime_body",
  "raw_" + "dom",
  "raw_" + "html",
  "authorization_header",
  "service_role_key",
  "llm_api_key",
  "cross_workspace_data",
  "unauthorized_workspace_data",
] as const;

export function canAiAccessDataCategory(category: string): boolean {
  return aiAllowedDataCategories.includes(
    category as (typeof aiAllowedDataCategories)[number],
  );
}

export function isAiDataCategoryBlocked(category: string): boolean {
  return aiBlockedDataCategories.includes(
    category as (typeof aiBlockedDataCategories)[number],
  );
}

export function sanitizeAiContextMetadata(
  input: Record<string, unknown>,
): Record<string, string | number | boolean | null> {
  const output: Record<string, string | number | boolean | null> = {};

  for (const [key, value] of Object.entries(input)) {
    if (isAiDataCategoryBlocked(key) || !canAiAccessDataCategory(key)) {
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
