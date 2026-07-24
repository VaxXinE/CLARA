import { describe, expect, it } from "vitest";
import { evaluateAiCostGuardrail } from "../src/ai/ai-cost-guardrail";

describe("P17 AI cost guardrail", () => {
  it("blocks requests above configured budget", () => {
    expect(
      evaluateAiCostGuardrail({
        estimatedCostCents: 11,
        dailyCostBudgetCents: 10,
        workspaceDailyBudgetCents: 0,
        operatorDailyBudgetCents: 0,
      }),
    ).toEqual({
      allowed: false,
      reasonCode: "ai_cost_budget_exceeded",
    });
  });
});
