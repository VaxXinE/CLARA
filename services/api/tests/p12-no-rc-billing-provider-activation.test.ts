import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-RC-PASS-FAIL-POLICY.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 RC no billing/provider activation", () => {
  it("blocks billing, payment, provider, AI, outbound, and automation side effects", () => {
    expect(doc).toContain(
      "Billing/payment/provider/AI/outbound side effect activation",
    );
    expect(doc).toContain("Queue job");
    expect(doc).toContain("alert");
    expect(doc).toContain("backup");
    expect(doc).toContain("restore");
    expect(doc).toContain("load-test");
  });
});
