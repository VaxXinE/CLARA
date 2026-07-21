import { describe, expect, it } from "vitest";
import { getLoadTestProfilePolicy } from "../src/reliability/load-test-profile-policy";

describe("P11 load test profile policy", () => {
  it("keeps heavy load tests manual and external-provider-free", () => {
    expect(getLoadTestProfilePolicy()).toMatchObject({
      scenarioCatalogDefined: true,
      smokeProfileDefined: true,
      baselineProfileDefined: true,
      stressProfileDefinedForManualUse: true,
      soakProfileDefinedForManualUse: true,
      ciHeavyLoadExecutionEnabled: false,
      externalProviderCallsAllowed: false,
    });
  });
});
