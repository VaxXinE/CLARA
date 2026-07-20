import { describe, expect, it } from "vitest";
import { getCapacityPerformanceTargetPolicy } from "../src/reliability/capacity-performance-target-policy";

describe("P11 capacity performance target policy", () => {
  it("keeps capacity targets out of normal test/build load execution", () => {
    const policy = getCapacityPerformanceTargetPolicy()[0];

    expect(policy).toBeDefined();
    if (!policy) return;
    expect(policy.summary).toContain("heavy load tests must not run");
    expect(policy.workspaceScoped).toBe(true);
    expect(policy.aggregateFirst).toBe(true);
    expect(policy.mutationEnabled).toBe(false);
  });
});
