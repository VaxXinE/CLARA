import { describe, expect, it } from "vitest";
import { getReliabilityBaselinePolicy } from "../src/reliability/reliability-baseline-policy";

describe("P11 reliability baseline policy", () => {
  it("requires idempotency, retry safety, failure isolation, and safe fallback behavior", () => {
    const text = getReliabilityBaselinePolicy()
      .map((item) => `${item.label} ${item.summary}`)
      .join(" ");

    expect(text).toContain("Idempotency");
    expect(text).toContain("retry");
    expect(text).toContain("backoff");
    expect(text).toContain("deduplication");
    expect(text).toContain("Failure isolation");
    expect(text).toContain("safe summaries");
  });
});
