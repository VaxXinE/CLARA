import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(
  resolve("src/analytics/internal-crm-dashboard-analytics-service.ts"),
  "utf8",
);

describe("P13 internal dashboard analytics provider and AI boundary", () => {
  it("does not call provider, AI, or outbound send code", () => {
    expect(source).not.toContain("send(");
    expect(source).not.toContain("generateDraft");
    expect(source).not.toContain("Gmail");
    expect(source).not.toContain("OpenAI");
    expect(source).not.toContain("fetch(");
  });
});
