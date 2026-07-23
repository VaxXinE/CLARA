import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P15 extension smoke execution checklist", () => {
  it("keeps extension bounded to safe snapshot and companion behavior", () => {
    const doc = readFileSync(
      resolve(
        root,
        "docs/product/CLARA-P15-EXTENSION-SMOKE-EXECUTION-CHECKLIST.md",
      ),
      "utf8",
    ).replace(/\s+/g, " ");

    expect(doc).toContain("Extension snapshot bridge remains local/internal");
    expect(doc).toContain(
      "ChatGPT Companion remains safe context preview/copy/open only",
    );
    expect(doc).toContain("does not add role management");
  });
});
