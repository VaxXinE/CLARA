import { render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AiAutomationGuardrailsPanel } from "./AiAutomationGuardrailsPanel";

describe("P7 final AI accessibility", () => {
  it("exposes the AI guardrail panel and control with accessible names", () => {
    const { container } = render(
      <AiAutomationGuardrailsPanel
        decision={null}
        loading={false}
        error={null}
        canEvaluate
        onEvaluate={() => {}}
      />,
    );
    const view = within(container);

    expect(
      view.getByRole("region", { name: "AI automation guardrails" }),
    ).toBeInTheDocument();
    expect(
      view.getByRole("button", { name: "Evaluate suggestion safety" }),
    ).toBeEnabled();
  });

  it("keeps disabled safety checks readable", () => {
    const { container } = render(
      <AiAutomationGuardrailsPanel
        decision={null}
        loading={false}
        error="AI guardrail check is unavailable."
        canEvaluate={false}
        onEvaluate={() => {}}
      />,
    );
    const view = within(container);

    expect(
      view.getByText("AI guardrail check is unavailable."),
    ).toBeInTheDocument();
    expect(
      view.getByRole("button", { name: "Evaluate suggestion safety" }),
    ).toBeDisabled();
  });
});
