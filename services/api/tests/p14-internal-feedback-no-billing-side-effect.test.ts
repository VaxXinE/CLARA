import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "src");

describe("P14 internal feedback no billing side effect", () => {
  it("does not activate billing or payment behavior for feedback", () => {
    const runtime = [
      "auth/permissions.ts",
      "customers/customer-service.ts",
      "conversations/conversation-service.ts",
    ]
      .map((file) => readFileSync(resolve(root, file), "utf8"))
      .join("\n");

    expect(runtime).not.toMatch(/stripe|checkout|invoice|chargeCustomer/i);
    expect(runtime).not.toMatch(/createSubscription|subscriptionMutation/);
  });
});
