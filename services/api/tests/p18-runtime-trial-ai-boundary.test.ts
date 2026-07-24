import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = [
  "docs/product/CLARA-P18-CONTROLLED-INTERNAL-RUNTIME-TRIAL-SCOPE.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ENVIRONMENT-BOUNDARY.md",
  "docs/product/CLARA-P18-RUNTIME-TRIAL-PRIVACY-POLICY.md",
]
  .map((file) => readFileSync(resolve(root, file), "utf8"))
  .join("\n");

describe("P18 runtime trial AI boundary", () => {
  it("keeps AI server-side and authorization backend-sourced", () => {
    expect(text).toContain("AI analysis remains backend/server-side");
    expect(text).toContain("AI provider secrets remain server-only");
    expect(text).toContain("Extension must not call AI providers directly");
    expect(text).toContain(
      "AuthContext and workspace membership remain source of truth",
    );
    expect(text).toContain("Client-supplied workspaceId is not authoritative");
  });
});
