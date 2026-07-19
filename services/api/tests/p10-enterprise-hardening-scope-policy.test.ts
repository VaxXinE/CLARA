import { describe, expect, it } from "vitest";
import {
  enterpriseHardeningCategories,
  getEnterpriseHardeningScope,
  isCertificationClaimAllowed,
} from "../src/enterprise/enterprise-hardening-scope-policy";

describe("P10 enterprise hardening scope policy", () => {
  it("defines the P10 readiness categories without claiming certification", () => {
    const scope = getEnterpriseHardeningScope();

    expect(scope.map((item) => item.category)).toEqual(
      enterpriseHardeningCategories,
    );
    expect(scope.every((item) => item.guardrails.length > 0)).toBe(true);
    expect(isCertificationClaimAllowed("compliance readiness only")).toBe(true);
    expect(isCertificationClaimAllowed("SOC 2 certified")).toBe(false);
    expect(isCertificationClaimAllowed("ISO 27001 certified")).toBe(false);
    expect(isCertificationClaimAllowed("GDPR compliant")).toBe(false);
  });
});
