import { describe, expect, it } from "vitest";
import { evaluateAiAssistantCapability } from "../src/ai/ai-assistant-safety-policy";
import {
  aiAssistantAllowedCapabilities,
  aiAssistantBlockedCapabilities,
} from "../src/ai/ai-assistant-scope";

describe("P7 AI assistant safety policy", () => {
  it("allows safe assistant suggestion capabilities", () => {
    expect(aiAssistantAllowedCapabilities).toEqual(
      expect.arrayContaining([
        "conversation_summary",
        "reply_suggestion",
        "follow_up_suggestion",
        "safe_draft_creation",
      ]),
    );
    expect(evaluateAiAssistantCapability("reply_suggestion")).toEqual({
      allowed: true,
      safeReasonCode: "ai_capability_allowed",
    });
  });

  it("blocks auto-send and autonomous provider actions", () => {
    expect(aiAssistantBlockedCapabilities).toEqual(
      expect.arrayContaining([
        "auto_send_message",
        "autonomous_provider_action",
        "role_user_mutation",
      ]),
    );
    expect(evaluateAiAssistantCapability("auto_send_message")).toEqual({
      allowed: false,
      safeReasonCode: "ai_policy_blocked",
    });
    expect(evaluateAiAssistantCapability("autonomous_provider_action")).toEqual(
      {
        allowed: false,
        safeReasonCode: "ai_policy_blocked",
      },
    );
  });
});
