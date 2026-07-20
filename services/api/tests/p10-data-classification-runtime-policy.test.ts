import { describe, expect, it } from "vitest";
import {
  complianceClassifications,
  getDataClassificationRules,
} from "../src/enterprise/data-classification-runtime-policy";

describe("P10 data classification runtime policy", () => {
  it("defines required classifications and safe runtime rules", () => {
    expect(complianceClassifications).toEqual([
      "public",
      "internal",
      "confidential",
      "restricted",
      "secret",
    ]);

    const rules = getDataClassificationRules();

    expect(rules.map((rule) => rule.dataClassKey)).toContain(
      "credential_material",
    );
    expect(
      rules.find((rule) => rule.dataClassKey === "credential_material"),
    ).toMatchObject({
      classification: "secret",
      auditSafe: false,
      dashboardSafe: false,
      extensionSafe: false,
    });
  });
});
