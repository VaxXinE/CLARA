import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("P19 internal deployment DB migration bootstrap", () => {
  it("keeps explicit migration and owner bootstrap commands available", () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(process.cwd(), "package.json"), "utf8"),
    ) as { scripts: Record<string, string> };

    expect(packageJson.scripts["db:ready"]).toContain("ready.ts");
    expect(packageJson.scripts["db:migrate"]).toContain("migrate.ts");
    expect(packageJson.scripts["db:bootstrap-owner"]).toContain(
      "bootstrap-owner.ts",
    );
  });
});
