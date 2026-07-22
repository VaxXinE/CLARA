import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-LOCAL-DEMO-SMOKE-FLOW.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 local demo smoke flow", () => {
  it("covers demo auth, conversation selection, composer, AI review, and readiness panels", () => {
    for (const step of [
      "Demo auth",
      "Select a conversation",
      "customer context",
      "Copy and clear local draft",
      "AI suggestion",
      "viewer remains read-only",
      "readiness-only panels",
    ]) {
      expect(doc).toContain(step);
    }
  });
});
