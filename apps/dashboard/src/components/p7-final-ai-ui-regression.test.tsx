import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AiAutomationGuardrailsPanel } from "./AiAutomationGuardrailsPanel";
import appSource from "../App.tsx?raw";
import conversationPaneSource from "./ConversationPane.tsx?raw";

describe("P7 final AI UI regression", () => {
  it("renders AI guardrail status as evaluation-only", () => {
    render(
      <AiAutomationGuardrailsPanel
        decision={{
          decisionId: "ai_auto_decision_demo",
          decision: "requires_human_approval",
          actionType: "create_draft",
          riskLevel: "medium",
          blockedReason: null,
          safeReasonCode: "ai_automation_human_approval_required",
          safetyFlags: [],
          requiresHumanApproval: true,
          actionStatus: "evaluation_only",
          policyVersion: "p7-ai-automation-guardrails-v1",
          createdAt: "2026-01-01T00:00:00.000Z",
        }}
        loading={false}
        error={null}
        canEvaluate
        onEvaluate={() => {}}
      />,
    );

    expect(screen.getByText("Evaluation only")).toBeInTheDocument();
    expect(screen.getByText("Needs human approval")).toBeInTheDocument();
    expect(screen.getByText(/Human approval is required/)).toBeInTheDocument();
  });

  it("does not add AI send, customer note save, task, or scheduler execution controls", () => {
    const source = [appSource, conversationPaneSource].join("\n");

    expect(source).not.toContain("AI Send");
    expect(source).not.toContain("Auto Save Customer Note");
    expect(source).not.toContain("Create Task");
    expect(source).not.toContain("Schedule Reminder");
  });
});
