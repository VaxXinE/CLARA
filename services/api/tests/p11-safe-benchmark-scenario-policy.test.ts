import { describe, expect, it } from "vitest";
import { getSafeBenchmarkScenarioPolicy } from "../src/reliability/safe-benchmark-scenario-policy";

describe("P11 safe benchmark scenario policy", () => {
  it("lists only synthetic or conceptual scenarios", () => {
    const scenarios = getSafeBenchmarkScenarioPolicy();

    expect(scenarios).toContain("api_read_only_endpoint_smoke");
    expect(scenarios).toContain("billing_readiness_conceptual_profile");
    expect(JSON.stringify(scenarios)).not.toContain("production");
  });
});
