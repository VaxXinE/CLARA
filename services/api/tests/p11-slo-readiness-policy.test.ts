import { describe, expect, it } from "vitest";
import { getSloReadinessPolicy } from "../src/reliability/slo-readiness-policy";

describe("P11 SLO readiness policy", () => {
  it("covers SLO readiness without making an external SLA promise", () => {
    const policy = getSloReadinessPolicy();
    const text = policy.map((item) => item.summary).join(" ");

    expect(policy.map((item) => item.key)).toEqual(["availability", "latency"]);
    expect(text).toContain("no external SLA is promised");
    expect(text).toContain("API, dashboard, webhook, job, and outbound");
    expect(policy.every((item) => item.mutationEnabled === false)).toBe(true);
  });
});
