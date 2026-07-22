import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-SMOKE-TEST-MATRIX.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 smoke test matrix policy", () => {
  it("uses the required smoke matrix columns", () => {
    for (const column of [
      "Area",
      "Flow",
      "Actor/role",
      "Preconditions",
      "Steps",
      "Expected result",
      "Evidence",
      "Blocks RC?",
      "Notes",
    ]) {
      expect(doc).toContain(column);
    }
  });

  it("forbids smoke-test side effects", () => {
    expect(doc).toContain(
      "Smoke tests must not activate billing/payment/provider/AI/outbound side effects.",
    );
  });
});
