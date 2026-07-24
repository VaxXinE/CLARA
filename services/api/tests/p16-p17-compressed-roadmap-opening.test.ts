import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docPath = "docs/product/CLARA-P16-P17-COMPRESSED-ROADMAP.md";

describe("P16/P17 compressed roadmap opening", () => {
  it("exists and keeps future roadmap compressed and safe", () => {
    expect(existsSync(resolve(root, docPath))).toBe(true);
    const doc = readFileSync(resolve(root, docPath), "utf8").replace(
      /\s+/g,
      " ",
    );

    expect(doc).toContain(
      "P16-PR-01 Extension-Assisted Channel Scope + Consent + Threat Model",
    );
    expect(doc).toContain(
      "P17-PR-04 Final Extension-Assisted AI Runtime QA + Security Runbook",
    );
    expect(doc).toContain(
      "real AI provider calls remain not activated in this PR",
    );
  });
});
