import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "src");

describe("P14 final internal beta no billing side effect", () => {
  it("does not add runtime billing or payment activation", () => {
    const runtime = [
      "auth/permissions.ts",
      "customers/customer-service.ts",
      "conversations/conversation-service.ts",
    ]
      .map((file) => readFileSync(resolve(root, file), "utf8"))
      .join("\n");

    expect(runtime).not.toMatch(/stripe|checkout|invoice|chargeCustomer/i);
    expect(runtime).not.toMatch(/createSubscription|subscriptionMutation/i);
    expect(runtime).not.toMatch(/paymentProvider|paymentIntent/i);
  });
});
