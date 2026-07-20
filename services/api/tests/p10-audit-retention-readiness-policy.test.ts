import { describe, expect, it } from "vitest";
import { getAuditRetentionCategories } from "../src/enterprise/audit-retention-readiness-policy";

describe("P10 audit retention readiness policy", () => {
  it("defines safe retention categories without automation", () => {
    const categories = getAuditRetentionCategories();

    expect(categories.length).toBeGreaterThan(0);
    expect(
      categories.every(
        (category) => category.rawSensitiveDataAllowed === false,
      ),
    ).toBe(true);
    expect(
      categories.every((category) => category.redactionRequired === true),
    ).toBe(true);
    expect(categories.map((category) => category.categoryKey)).toContain(
      "audit_events",
    );
  });
});
