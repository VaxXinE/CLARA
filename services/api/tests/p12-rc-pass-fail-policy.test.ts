import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-RC-PASS-FAIL-POLICY.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 RC pass/fail policy", () => {
  it("defines pass, blocker, accepted limitation, deferred issue, and rollback", () => {
    for (const state of [
      "Required pass",
      "Blocker fail",
      "Accepted known limitation",
      "Deferred issue",
      "Rollback to previous candidate",
    ]) {
      expect(doc).toContain(state);
    }
  });

  it("blocks unsafe launch behavior", () => {
    expect(doc).toContain("Auth/session bypass");
    expect(doc).toContain("Workspace isolation failure");
    expect(doc).toContain(
      "Billing/payment/provider/AI/outbound side effect activation",
    );
  });
});
