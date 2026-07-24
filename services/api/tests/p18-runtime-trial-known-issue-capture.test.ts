import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const templateText = readFileSync(
  resolve(
    root,
    "docs/product/CLARA-P18-RUNTIME-TRIAL-KNOWN-ISSUE-CAPTURE-TEMPLATE.md",
  ),
  "utf8",
);
const severityText = readFileSync(
  resolve(
    root,
    "docs/product/CLARA-P18-RUNTIME-TRIAL-BLOCKER-SEVERITY-RULES.md",
  ),
  "utf8",
);

describe("P18 runtime trial known issue capture", () => {
  it("defines known issue template and blocker severity rules", () => {
    expect(templateText).toContain("Issue ID:");
    expect(templateText).toContain("Checklist item:");
    expect(templateText).toContain("Safe reason_code:");
    expect(severityText).toContain("Blocker");
    expect(severityText).toContain("High");
    expect(severityText).toContain("Medium");
    expect(severityText).toContain("Low");
    expect(severityText).toContain("Workspace isolation bypass");
    expect(severityText).toContain("Outbound auto-send activation");
  });
});
