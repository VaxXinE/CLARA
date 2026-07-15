import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AiAutomationGuardrailsPanel } from "./AiAutomationGuardrailsPanel";

describe("AiAutomationGuardrailsPanel", () => {
  it("renders evaluation-only readiness", () => {
    render(
      <AiAutomationGuardrailsPanel
        decision={null}
        loading={false}
        error={null}
        canEvaluate={true}
        onEvaluate={vi.fn()}
      />,
    );

    expect(screen.getByText("Automation readiness")).toBeInTheDocument();
    expect(screen.getByText("Evaluation only")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Evaluate suggestion safety" }),
    ).toBeEnabled();
  });

  it("renders a blocked decision without sensitive content", () => {
    render(
      <AiAutomationGuardrailsPanel
        loading={false}
        error={null}
        canEvaluate={true}
        onEvaluate={vi.fn()}
        decision={{
          decisionId: "ai_auto_decision_demo",
          decision: "blocked",
          actionType: "auto_send_email",
          riskLevel: "high",
          blockedReason: "The requested action is not allowed.",
          safeReasonCode: "ai_automation_action_blocked",
          safetyFlags: [],
          requiresHumanApproval: false,
          actionStatus: "evaluation_only",
          policyVersion: "p7-ai-automation-guardrails-v1",
          createdAt: "2026-01-01T00:00:00.000Z",
        }}
      />,
    );

    const text = document.body.textContent ?? "";

    expect(screen.getByText("Blocked")).toBeInTheDocument();
    expect(text).toContain("ai_automation_action_blocked");
    expect(text).not.toContain("access token");
    expect(text).not.toContain("refresh token");
    expect(text).not.toContain("Authorization");
    expect(text).not.toContain("raw provider payload");
  });
});
