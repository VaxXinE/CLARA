import { describe, expect, it } from "vitest";
import { evaluateAiAutomationRisk } from "../src/ai/ai-automation-risk-policy";

describe("AI automation risk policy", () => {
  it("allows low-risk actions", () => {
    expect(
      evaluateAiAutomationRisk({
        category: "allowed",
        abuseDetected: false,
        crossWorkspaceAttempt: false,
      }),
    ).toMatchObject({
      decision: "allowed",
      riskLevel: "low",
      requiresHumanApproval: false,
    });
  });

  it("requires human approval for restricted actions", () => {
    expect(
      evaluateAiAutomationRisk({
        category: "restricted",
        abuseDetected: false,
        crossWorkspaceAttempt: false,
      }),
    ).toMatchObject({
      decision: "requires_human_approval",
      riskLevel: "medium",
      requiresHumanApproval: true,
    });
  });

  it("blocks abuse and cross-workspace attempts", () => {
    expect(
      evaluateAiAutomationRisk({
        category: "allowed",
        abuseDetected: true,
        crossWorkspaceAttempt: false,
      }),
    ).toMatchObject({
      decision: "blocked",
      safeReasonCode: "ai_automation_abuse_detected",
    });

    expect(
      evaluateAiAutomationRisk({
        category: "allowed",
        abuseDetected: false,
        crossWorkspaceAttempt: true,
      }),
    ).toMatchObject({
      decision: "blocked",
      safeReasonCode: "cross_workspace_action_blocked",
    });
  });
});
