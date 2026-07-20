import { describe, expect, it } from "vitest";
import { getUsageMeteringReadinessPolicy } from "../src/billing/usage-metering-readiness-policy";

describe("P11 usage metering readiness policy", () => {
  it("keeps usage metering workspace-scoped, aggregate-first, and free of raw sensitive data", () => {
    const policy = getUsageMeteringReadinessPolicy()[0];

    expect(policy).toBeDefined();
    if (!policy) return;
    expect(policy.workspaceScoped).toBe(true);
    expect(policy.aggregateFirst).toBe(true);
    expect(policy.summary).toContain("no raw messages");
    expect(policy.summary).toContain("provider payloads");
    expect(policy.summary).toContain("webhook payloads");
    expect(policy.summary).toContain("secrets");
  });
});
