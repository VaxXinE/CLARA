import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const runtimeFiles = [
  "services/api/src/auth/owner-bootstrap-service.ts",
  "services/api/src/auth/user-role-management-service.ts",
  "services/api/src/auth/user-role-management-policy.ts",
  "services/api/src/http/routes/user-role-management.ts",
];

describe("P14 internal user bootstrap no billing side effect", () => {
  it("does not add payment, invoice, checkout, subscription, or quota enforcement runtime behavior", () => {
    const source = runtimeFiles
      .map((file) =>
        readFileSync(resolve(process.cwd(), "..", "..", file), "utf8"),
      )
      .join("\n");

    expect(source).not.toMatch(/stripe|checkout|invoice|chargeCustomer/i);
    expect(source).not.toMatch(/subscriptionMutation|createSubscription/i);
    expect(source).not.toMatch(/quotaEnforce|enforceQuota/i);
  });
});
