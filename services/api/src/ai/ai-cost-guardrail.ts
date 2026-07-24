export type AiCostGuardrailInput = {
  estimatedCostCents: number;
  dailyCostBudgetCents: number;
  workspaceDailyBudgetCents: number;
  operatorDailyBudgetCents: number;
};

export function evaluateAiCostGuardrail(input: AiCostGuardrailInput): {
  allowed: boolean;
  reasonCode: "ok" | "ai_cost_budget_exceeded";
} {
  const budgets = [
    input.dailyCostBudgetCents,
    input.workspaceDailyBudgetCents,
    input.operatorDailyBudgetCents,
  ];

  const exceeded = budgets.some(
    (budget) => budget > 0 && input.estimatedCostCents > budget,
  );

  return {
    allowed: !exceeded,
    reasonCode: exceeded ? "ai_cost_budget_exceeded" : "ok",
  };
}
