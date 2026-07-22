import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-ROLLBACK-EVIDENCE-CHECKLIST.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 rollback evidence checklist", () => {
  it("captures required safe evidence", () => {
    for (const item of [
      "Branch/commit SHA",
      "Release candidate identifier",
      "Validator output",
      "Test counts",
      "Build outputs",
      "npm audit 0 vulnerabilities result",
      "Config readiness check",
      "Migration readiness check",
      "Rollback rehearsal result",
      "Post-deployment smoke result",
      "Known limitations review",
      "Go/no-go approval",
    ]) {
      expect(doc).toContain(item);
    }
  });
});
