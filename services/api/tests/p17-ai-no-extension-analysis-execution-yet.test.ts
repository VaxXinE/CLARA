import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const extensionRoute = readFileSync(
  join(process.cwd(), "src/http/routes/extension.ts"),
  "utf8",
);

describe("P17 extension ingestion does not auto-run analysis", () => {
  it("keeps analysis behind the explicit backend analysis route", () => {
    expect(extensionRoute).not.toMatch(
      /runAiAnalysis|analyzeExtensionSnapshot/,
    );
    expect(extensionRoute).not.toMatch(/AI_PROVIDER_API_KEY/);
  });
});
