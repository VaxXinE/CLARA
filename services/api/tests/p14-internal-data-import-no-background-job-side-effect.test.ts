import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("P14 internal data import no background job side effect", () => {
  it("does not enqueue jobs or start queue execution", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/customers/internal-data-import-policy.ts"),
      "utf8",
    );

    expect(source).not.toMatch(/queue\.add|enqueue|cron|worker/i);
  });
});
