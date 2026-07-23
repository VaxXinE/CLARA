import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P14 internal feedback triage policy", () => {
  it("keeps feedback triage manual and repo-safe", () => {
    const runbook = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P14-INTERNAL-FEEDBACK-TRIAGE-RUNBOOK.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(runbook).toContain(
      "Feedback triage is manual/local/repo-safe unless separately approved",
    );
    expect(runbook).toContain(
      "no external support tool integration is activated",
    );
    expect(runbook).toContain("Do not send notification webhooks");
  });
});
