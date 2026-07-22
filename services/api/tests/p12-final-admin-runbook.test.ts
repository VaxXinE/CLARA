import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-FINAL-ADMIN-RUNBOOK.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 final admin runbook", () => {
  it("keeps admin review read-only and backend-authoritative", () => {
    expect(doc).toContain("Backend AuthContext remains authority");
    expect(doc).toContain("Client workspaceId is never authority");
    expect(doc).toContain("Frontend role guard remains UX-only");
    expect(doc).toContain(
      "No doc claims production deployed or public GA launched",
    );
  });
});
