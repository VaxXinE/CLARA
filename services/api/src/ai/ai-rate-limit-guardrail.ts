export function evaluateAiRateLimitGuardrail(input: {
  attemptedCount: number;
  maxCount: number;
}): {
  allowed: boolean;
  reasonCode: "ok" | "ai_rate_limit_exceeded";
} {
  const allowed = input.attemptedCount <= input.maxCount;

  return {
    allowed,
    reasonCode: allowed ? "ok" : "ai_rate_limit_exceeded",
  };
}
