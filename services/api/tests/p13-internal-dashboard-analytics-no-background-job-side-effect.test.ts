import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(
  resolve("src/analytics/internal-crm-dashboard-analytics-service.ts"),
  "utf8",
);

describe("P13 internal dashboard analytics background job boundary", () => {
  it("does not create scheduler, export, cron, or queue work", () => {
    expect(source).not.toContain("setInterval");
    expect(source).not.toContain("setTimeout");
    expect(source).not.toContain("enqueue");
    expect(source).not.toContain("createExport");
    expect(source).not.toContain("cron");
  });
});
