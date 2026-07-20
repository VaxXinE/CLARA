import { describe, expect, it } from "vitest";
import { getComplianceDashboardCategories } from "../src/enterprise/compliance-dashboard-policy";

describe("P10 compliance dashboard policy", () => {
  it("defines safe evidence categories without export behavior", () => {
    const categories = getComplianceDashboardCategories();

    expect(categories.map((category) => category.categoryKey)).toContain(
      "admin_sessions",
    );
    expect(
      categories.every((category) => category.safeEvidenceSummary.length > 0),
    ).toBe(true);
  });
});
