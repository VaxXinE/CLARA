import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const docs = [
  "CLARA-P12-PRODUCTION-DEPLOYMENT-CHECKLIST.md",
  "CLARA-P12-ROLLBACK-DRILL-RUNBOOK.md",
  "CLARA-P12-DEPLOYMENT-CUTOVER-GO-NO-GO-POLICY.md",
].map((name) =>
  readFileSync(
    new URL(`../../../docs/product/${name}`, import.meta.url),
    "utf8",
  ),
);

describe("P12 no production deploy automation regression", () => {
  it("states deployment docs are readiness-only and not production execution", () => {
    const text = docs.join("\n");

    expect(text).toContain("CLARA is not production deployed yet");
    expect(text).toContain(
      "The deployment checklist is a readiness gate, not deployment execution",
    );
    expect(text).not.toContain("deployProduction()");
    expect(text).not.toContain("productionDeploy()");
  });
});
