import { describe, expect, it } from "vitest";
import {
  getRateLimitQuotaUsageControls,
  getRateLimitReadinessPolicy,
} from "../src/reliability/rate-limit-readiness-policy";

describe("P11 rate limit readiness policy", () => {
  it("defines safe rate limit readiness without destructive throttles", () => {
    expect(getRateLimitReadinessPolicy()).toEqual({
      policyDefined: true,
      perWorkspaceLimitDefined: true,
      perUserLimitDefined: true,
      perEndpointLimitDefined: true,
      burstLimitPolicyDefined: true,
      safe429BehaviorDefined: true,
      productionQuotaBlockingImplemented: false,
      destructiveThrottleImplemented: false,
    });
  });

  it("includes readiness controls for rate, quota, usage, billing, and client boundaries", () => {
    expect(
      getRateLimitQuotaUsageControls().map((control) => control.controlKey),
    ).toEqual([
      "rate_limit_readiness",
      "quota_readiness",
      "usage_metering_readiness",
      "billing_side_effect_boundary",
      "dashboard_extension_boundary",
    ]);
  });
});
