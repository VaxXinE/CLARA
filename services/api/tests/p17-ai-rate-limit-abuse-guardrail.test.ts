import { describe, expect, it } from "vitest";
import { evaluateAiRateLimitGuardrail } from "../src/ai/ai-rate-limit-guardrail";

describe("P17 AI rate limit and abuse guardrail", () => {
  it("blocks attempts over the configured maximum", () => {
    expect(
      evaluateAiRateLimitGuardrail({ attemptedCount: 6, maxCount: 5 }),
    ).toEqual({
      allowed: false,
      reasonCode: "ai_rate_limit_exceeded",
    });
  });
});
