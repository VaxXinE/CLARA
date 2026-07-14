export const aiHumanApprovalRequiredActions = [
  "send_reply",
  "create_follow_up_task",
  "update_customer_notes",
  "provider_action",
  "automation_execution",
] as const;

export const aiAlwaysBlockedActions = [
  "connect_provider",
  "disconnect_provider",
  "change_role",
  "invite_user",
  "delete_user",
  "change_billing",
] as const;

export function requiresAiHumanApproval(action: string): boolean {
  return aiHumanApprovalRequiredActions.includes(
    action as (typeof aiHumanApprovalRequiredActions)[number],
  );
}

export function isAiActionAlwaysBlocked(action: string): boolean {
  return aiAlwaysBlockedActions.includes(
    action as (typeof aiAlwaysBlockedActions)[number],
  );
}
