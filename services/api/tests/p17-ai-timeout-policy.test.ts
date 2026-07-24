import { describe, expect, it } from "vitest";
import { resolveAiRequestTimeoutMs } from "../src/ai/ai-timeout-policy";

describe("P17 AI timeout policy", () => {
  it("rejects invalid timeout values", () => {
    expect(() => resolveAiRequestTimeoutMs(0)).toThrow(
      "Invalid AI timeout policy.",
    );
    expect(resolveAiRequestTimeoutMs(15_000)).toBe(15_000);
  });
});
