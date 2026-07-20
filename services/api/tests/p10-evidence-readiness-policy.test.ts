import { describe, expect, it } from "vitest";
import { getEvidenceReadinessCategories } from "../src/enterprise/evidence-readiness-policy";

describe("P10 evidence readiness policy", () => {
  it("defines safe summary categories without export", () => {
    const categories = getEvidenceReadinessCategories();

    expect(categories.map((category) => category.categoryKey)).toContain(
      "audit_trail",
    );
    expect(categories.every((category) => category.rawEvidenceIncluded)).toBe(
      false,
    );
    expect(categories.every((category) => category.exportAllowed)).toBe(false);
  });
});
