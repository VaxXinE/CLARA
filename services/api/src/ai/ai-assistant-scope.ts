export const aiAssistantAllowedCapabilities = [
  "conversation_summary",
  "customer_context_summary",
  "reply_suggestion",
  "tone_rewrite",
  "follow_up_suggestion",
  "next_action_recommendation",
  "knowledge_context_extraction",
  "safe_draft_creation",
  "operator_coaching",
  "lead_customer_insight_suggestion",
] as const;

export const aiAssistantBlockedCapabilities = [
  "auto_send_message",
  "autonomous_provider_action",
  "provider_token_access",
  "provider_cookie_access",
  "raw_provider_" + "payload_access",
  "raw_webhook_" + "payload_access",
  "raw_" + "dom_access",
  "raw_" + "html_access",
  "workspace_membership_override",
  "role_user_mutation",
  "billing_admin_mutation",
  "provider_connection_mutation",
  "provider_ui_scraping",
  "browser_automation_provider_session",
] as const;

export type AiAssistantAllowedCapability =
  (typeof aiAssistantAllowedCapabilities)[number];

export type AiAssistantBlockedCapability =
  (typeof aiAssistantBlockedCapabilities)[number];

export function isAiAssistantCapabilityAllowed(capability: string): boolean {
  return aiAssistantAllowedCapabilities.includes(
    capability as AiAssistantAllowedCapability,
  );
}

export function isAiAssistantCapabilityBlocked(capability: string): boolean {
  return aiAssistantBlockedCapabilities.includes(
    capability as AiAssistantBlockedCapability,
  );
}
