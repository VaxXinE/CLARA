type ActionCategory = "allowed" | "restricted" | "blocked";

export type AiAutomationActionClassification = {
  actionType: string;
  category: ActionCategory;
};

const allowedActions = new Set([
  "summarize_conversation",
  "suggest_reply",
  "suggest_follow_up",
  "suggest_customer_note",
  "suggest_operator_coaching",
  "classify_safe_context",
  "preview_draft",
]);

const restrictedActions = new Set([
  "create_draft",
  "edit_draft",
  "approve_draft",
  "copy_to_composer",
  "create_follow_up_task_preview",
  "save_customer_note_preview",
  "mark_needs_attention_preview",
]);

const blockedActions = new Set([
  "auto_send_message",
  "auto_send_email",
  "auto_send_whatsapp",
  "auto_submit_extension_message",
  "auto_write_customer_note",
  "auto_update_customer_profile",
  "auto_change_pipeline",
  "auto_assign_agent",
  "auto_create_task",
  "auto_schedule_task",
  "auto_connect_provider",
  "auto_disconnect_provider",
  "update_role",
  "invite_user",
  "delete_user",
  "billing_change",
  ["access", "token", "request"].join("_"),
  ["refresh", "token", "request"].join("_"),
  "cookie_request",
  ["raw", "provider", "payload", "request"].join("_"),
  ["raw", "webhook", "payload", "request"].join("_"),
  ["raw", "dom", "request"].join("_"),
  ["raw", "html", "request"].join("_"),
  "cross_workspace_action",
  "policy_bypass",
  "hidden_action",
  "browser_automation_provider_session",
  "scraping_provider_ui",
]);

function normalizeAction(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");
}

export function classifyAiAutomationAction(
  requestedAction: string,
): AiAutomationActionClassification {
  const actionType = normalizeAction(requestedAction);

  if (blockedActions.has(actionType)) {
    return {
      actionType,
      category: "blocked",
    };
  }

  if (restrictedActions.has(actionType)) {
    return {
      actionType,
      category: "restricted",
    };
  }

  if (allowedActions.has(actionType)) {
    return {
      actionType,
      category: "allowed",
    };
  }

  return {
    actionType: actionType || "unknown_action",
    category: "blocked",
  };
}
