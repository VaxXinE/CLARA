import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const customerRuntimeFiles = [
  "src/customers/customer-service.ts",
  "src/customers/customer-repository.ts",
  "src/customers/customer-db-repository.ts",
  "src/http/routes/customers.ts",
].map((file) => resolve(process.cwd(), file));

describe("P13 customer CRUD billing/payment side-effect regression", () => {
  it("keeps customer CRUD runtime free of billing and payment activation", () => {
    const runtimeSource = customerRuntimeFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    expect(runtimeSource).not.toMatch(/stripe|checkout|invoice|subscription/i);
    expect(runtimeSource).not.toMatch(/charge[A-Z_]|payment[A-Z_]/);
    expect(runtimeSource).not.toMatch(/quota.*enforce/i);
  });
});
