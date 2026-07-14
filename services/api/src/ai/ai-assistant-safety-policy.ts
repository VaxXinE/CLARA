import {
  isAiAssistantCapabilityAllowed,
  isAiAssistantCapabilityBlocked,
} from "./ai-assistant-scope";

export type AiAssistantSafetyDecision = {
  allowed: boolean;
  safeReasonCode:
    | "ai_capability_allowed"
    | "ai_policy_blocked"
    | "ai_human_approval_required";
};

export function evaluateAiAssistantCapability(
  capability: string,
): AiAssistantSafetyDecision {
  if (isAiAssistantCapabilityBlocked(capability)) {
    return {
      allowed: false,
      safeReasonCode: "ai_policy_blocked",
    };
  }

  if (isAiAssistantCapabilityAllowed(capability)) {
    return {
      allowed: true,
      safeReasonCode: "ai_capability_allowed",
    };
  }

  return {
    allowed: false,
    safeReasonCode: "ai_human_approval_required",
  };
}
