import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-POST-DEPLOYMENT-SMOKE-CHECKLIST.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 post deployment smoke checklist", () => {
  it("defines safe post-deployment smoke checks", () => {
    for (const check of [
      "API `/health`",
      "API `/ready`",
      "safe 401",
      "Dashboard loads",
      "Extension remains manual-assisted",
      "Workspace smoke",
      "Readiness-only panels",
      "AI review-only",
      "Provider readiness",
      "Billing readiness",
      "Analytics safe-summary",
    ]) {
      expect(doc).toContain(check);
    }
  });
});
