import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("P14 internal data import no billing side effect", () => {
  it("keeps import policy free of billing/payment activation", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/customers/internal-data-import-policy.ts"),
      "utf8",
    );

    expect(source).not.toMatch(/stripe|createCheckoutSession|createInvoice/i);
    expect(source).not.toMatch(/chargeCustomer|subscriptionMutation/i);
  });
});
