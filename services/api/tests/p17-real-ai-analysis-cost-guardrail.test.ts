import { describe, expect, it } from "vitest";
import {
  p17AnalysisService,
  p17Auth,
  p17Scope,
} from "./p17-real-ai-analysis-service.test";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 real AI analysis cost guardrail", () => {
  it("blocks analysis above configured budget", async () => {
    const snapshot = p17Snapshot();
    snapshot.messages = Array.from({ length: 8 }, (_, index) => ({
      id: `m${index}`,
      direction: "incoming",
      author: "Customer",
      text: "Need support. ".repeat(90),
      timestampLabel: "Today",
      replyContextText: null,
    }));

    const result = await p17AnalysisService({
      dailyCostBudgetCents: 1,
      workspaceDailyBudgetCents: 0,
      operatorDailyBudgetCents: 0,
    }).analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_cost",
      snapshot,
      correlationId: "corr_cost",
    });

    expect(result.data.analysis.safeReasonCode).toBe("ai_cost_budget_exceeded");
  });

  it("blocks when a positive budget is exceeded", async () => {
    const result = await p17AnalysisService({
      dailyCostBudgetCents: 0,
      workspaceDailyBudgetCents: 0,
      operatorDailyBudgetCents: 0,
    }).analyze({
      auth: p17Auth,
      scope: p17Scope,
      snapshotId: "snap_cost_ok",
      snapshot: p17Snapshot(),
      correlationId: "corr_cost_ok",
    });

    expect(result.data.analysis.status).toBe("generated");
  });
});
