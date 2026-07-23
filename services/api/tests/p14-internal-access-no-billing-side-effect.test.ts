import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "src");

function source(...files: string[]) {
  return files
    .map((file) => readFileSync(resolve(root, file), "utf8"))
    .join("\n");
}

describe("P14 internal access no billing side effect", () => {
  it("keeps access QA runtime paths free of billing/payment activation", () => {
    const runtime = source(
      "auth/permissions.ts",
      "auth/user-role-management-policy.ts",
      "customers/internal-data-import-policy.ts",
      "customers/customer-service.ts",
    );

    expect(runtime).not.toMatch(/stripe|createCheckoutSession|createInvoice/i);
    expect(runtime).not.toMatch(/chargeCustomer|subscriptionMutation/i);
  });
});
