import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 API smoke execution checklist", () => {
  it("documents API smoke checks and backend authority", () => {
    const doc = readFileSync(
      resolve(root, "docs/product/CLARA-P15-API-SMOKE-EXECUTION-CHECKLIST.md"),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("GET /health");
    expect(doc).toContain("GET /ready");
    expect(doc).toContain(
      "AuthContext and workspace membership remain source of truth",
    );
    expect(doc).toContain("client-supplied workspaceId is not authoritative");
  });
});
