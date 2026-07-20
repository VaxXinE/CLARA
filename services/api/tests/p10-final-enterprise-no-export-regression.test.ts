import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = [
  "../src/enterprise/evidence-readiness-dto.ts",
  "../src/enterprise/compliance-dashboard-dto.ts",
  "../src/http/routes/enterprise-evidence-readiness.ts",
]
  .map((path) => readFileSync(new URL(path, import.meta.url), "utf8"))
  .join("\n");

describe("P10 final enterprise no-export regression", () => {
  it("does not add evidence export, download, report generation, or customer drilldown", () => {
    for (const pattern of [
      "exportEvidence(",
      "downloadEvidence(",
      "generateReport(",
      "customerLevelDrilldown",
      ">Export<",
      ">Download<",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });
});
