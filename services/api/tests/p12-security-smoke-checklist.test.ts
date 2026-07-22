import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-SECURITY-SMOKE-CHECKLIST.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 security smoke checklist", () => {
  it("requires auth, workspace, redaction, and unsafe HTML checks", () => {
    expect(doc).toContain("safe 401");
    expect(doc).toContain("Workspace boundary remains server-authoritative");
    expect(doc).toContain("Client workspaceId is never authority");
    expect(doc).toContain("Viewer remains read-only");
    expect(doc).toContain("No `dangerouslySetInnerHTML`");
    expect(doc).toContain("No raw HTML rendering");
  });
});
