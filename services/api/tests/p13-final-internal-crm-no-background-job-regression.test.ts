import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const runtimeFiles = [
  "services/api/src/customers/customer-service.ts",
  "services/api/src/conversations/conversation-service.ts",
  "services/api/src/analytics/internal-crm-dashboard-analytics-service.ts",
].map((file) => resolve(process.cwd(), "..", "..", file));

describe("P13 final internal CRM background job regression", () => {
  it("does not add background jobs, queue execution, or heavy exports", () => {
    const source = runtimeFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    expect(source).not.toMatch(/enqueue|queue\.add|cron|worker/i);
    expect(source).not.toMatch(/createExport|generateReport|downloadReport/i);
  });
});
