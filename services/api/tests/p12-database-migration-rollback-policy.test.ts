import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-DATABASE-MIGRATION-ROLLBACK-CHECKLIST.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 database migration rollback policy", () => {
  it("requires backup, dry-run evidence, and rollback/forward-fix decision", () => {
    expect(doc).toContain("Backup readiness");
    expect(doc).toContain("Migration dry-run");
    expect(doc).toContain("Rollback/forward-fix decision");
    expect(doc).toContain("Workspace-scoped data access");
  });
});
