import { describe, expect, it } from "vitest";
import {
  complianceBaselineControlCategories,
  getComplianceBaselineScope,
} from "../src/enterprise/compliance-baseline-policy";

describe("P10 compliance baseline policy", () => {
  it("is readiness-only and covers required enterprise control categories", () => {
    const scope = getComplianceBaselineScope();

    expect(scope.readinessOnly).toBe(true);
    expect(scope.certificationClaimed).toBe(false);
    expect(scope.controlCategories).toEqual(
      complianceBaselineControlCategories,
    );
    expect(scope.controlCategories).toContain("access_control");
    expect(scope.controlCategories).toContain("audit_evidence");
    expect(scope.controlCategories).toContain("vendor_boundary");
    expect(scope.controlCategories).toContain("operational_readiness");
  });
});
