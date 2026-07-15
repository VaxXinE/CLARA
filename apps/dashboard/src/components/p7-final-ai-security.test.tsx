import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AiAutomationGuardrailsPanel } from "./AiAutomationGuardrailsPanel";
import appSource from "../App.tsx?raw";
import panelSource from "./AiAutomationGuardrailsPanel.tsx?raw";

describe("P7 final AI dashboard security", () => {
  it("does not use unsafe HTML rendering for AI surfaces", () => {
    expect([appSource, panelSource].join("\n")).not.toContain(
      ["dangerously", "Set", "Inner", "HTML"].join(""),
    );
  });

  it("does not display secret-like or raw context fields", () => {
    render(
      <AiAutomationGuardrailsPanel
        decision={{
          decisionId: "ai_auto_decision_demo",
          decision: "blocked",
          actionType: "raw_provider_payload_request",
          riskLevel: "critical",
          blockedReason: "The requested action is not allowed.",
          safeReasonCode: "ai_automation_action_blocked",
          safetyFlags: [],
          requiresHumanApproval: false,
          actionStatus: "evaluation_only",
          policyVersion: "p7-ai-automation-guardrails-v1",
          createdAt: "2026-01-01T00:00:00.000Z",
        }}
        loading={false}
        error={null}
        canEvaluate={false}
        onEvaluate={() => {}}
      />,
    );

    const text = document.body.textContent ?? "";
    expect(text).not.toContain("access token");
    expect(text).not.toContain("refresh token");
    expect(text).not.toContain("Authorization");
    expect(text).not.toContain("raw prompt");
  });
});
