import { describe, expect, it } from "vitest";
import {
  isAiActionAlwaysBlocked,
  requiresAiHumanApproval,
} from "../src/ai/ai-human-approval-policy";
import {
  aiAuditEventTypes,
  sanitizeAiAuditMetadata,
} from "../src/ai/ai-audit-policy";

describe("P7 AI human approval and audit policy", () => {
  it("requires human approval before AI suggestions become actions", () => {
    expect(requiresAiHumanApproval("send_reply")).toBe(true);
    expect(requiresAiHumanApproval("create_follow_up_task")).toBe(true);
    expect(requiresAiHumanApproval("automation_execution")).toBe(true);
  });

  it("blocks admin, role, billing, and provider mutations", () => {
    expect(isAiActionAlwaysBlocked("change_role")).toBe(true);
    expect(isAiActionAlwaysBlocked("invite_user")).toBe(true);
    expect(isAiActionAlwaysBlocked("change_billing")).toBe(true);
    expect(isAiActionAlwaysBlocked("connect_provider")).toBe(true);
  });

  it("defines safe AI audit events and sanitized metadata", () => {
    expect(aiAuditEventTypes).toEqual(
      expect.arrayContaining([
        "ai_suggestion_requested",
        "ai_suggestion_generated",
        "ai_prompt_injection_flagged",
        "ai_policy_blocked",
        "ai_human_approval_required",
      ]),
    );

    const metadata = sanitizeAiAuditMetadata({
      workspace_id: "wks_1",
      user_id: "usr_1",
      conversation_id: "conv_1",
      action_type: "reply_suggestion",
      safe_reason_code: "ai_policy_blocked",
      correlation_id: "corr_1",
      access_token: "atk",
      refresh_token: "rtk",
      raw_provider_payload: "unsafe",
      full_prompt: "unsafe prompt",
    });

    expect(metadata).toEqual({
      workspace_id: "wks_1",
      user_id: "usr_1",
      conversation_id: "conv_1",
      action_type: "reply_suggestion",
      safe_reason_code: "ai_policy_blocked",
      correlation_id: "corr_1",
    });
  });
});
