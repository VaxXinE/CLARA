import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-BLOCKER-ISSUE-CLASSIFICATION.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 blocker issue classification", () => {
  it("defines GA blocker categories", () => {
    for (const category of [
      "auth/session failure",
      "workspace isolation failure",
      "raw sensitive data exposure",
      "unsafe provider/payment/AI activation",
      "migration/data integrity failure",
      "dashboard cannot complete critical smoke flow",
      "extension leaks unsafe data",
      "support workflow cannot handle beta issues",
      "unresolved S0/S1 known issue",
      "undocumented limitation that affects beta users",
    ]) {
      expect(doc).toContain(category);
    }
  });
});
