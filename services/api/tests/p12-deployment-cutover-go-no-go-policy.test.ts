import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-DEPLOYMENT-CUTOVER-GO-NO-GO-POLICY.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 deployment cutover go/no-go policy", () => {
  it("defines required no-go and rollback blockers", () => {
    for (const blocker of [
      "Auth failure",
      "Workspace isolation failure",
      "Data exposure risk",
      "Raw token/secret exposure",
      "Migration failure",
      "Health/ready failure",
      "Dashboard unable to connect API",
      "Unsafe provider/payment/AI activation",
      "Audit redaction failure",
      "Critical smoke test failure",
      "Unreviewed known limitation",
    ]) {
      expect(doc).toContain(blocker);
    }
  });
});
