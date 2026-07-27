import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const files = [
  "README.md",
  "docs/product/CLARA-P19-ROADMAP.md",
  "docs/product/CLARA-FINAL-ROADMAP.md",
  "docs/product/CLARA-DOCUMENTATION-INDEX.md",
];

describe("Post-P19 real internal CRM complete handoff", () => {
  it("marks P19 complete without launch or automation claims", () => {
    const text = files
      .map((file) => readFileSync(resolve(process.cwd(), "../..", file), "utf8"))
      .join("\n")
      .replace(/\s+/g, " ");

    expect(text).toContain("P19 is complete");
    expect(text).toContain("P19-PR-05 is complete");
    expect(text).toContain("Post-P19 handoff summary exists");
    expect(text).toContain("Any next phase requires separate explicit product approval");
    expect(text).toContain("Internal team usage must use provider auth");
    expect(text).toContain("Backend AuthContext/workspace membership is source of truth");
    expect(text).toContain("client-supplied workspaceId is not authoritative");
    expect(text).toContain("CLARA is not public GA launch");
    expect(text).toContain("CLARA is not public SaaS launch");
    expect(text).toContain("CLARA is not production deployment");
    expect(text).toContain("Billing/payment remains deferred");
    expect(text).toContain("Official WA/IG/TikTok APIs remain not activated");
    expect(text).toContain("Outbound auto-send remains disabled");
    expect(text).not.toMatch(/public GA launch is complete/i);
    expect(text).not.toMatch(/production deployment is complete/i);
  });
});
