import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("P17 AI context no real provider call yet", () => {
  it("keeps context building pure and provider-call-free", () => {
    const source = readFileSync(
      join(process.cwd(), "src/ai/extension-snapshot-ai-context-builder.ts"),
      "utf8",
    );

    expect(source).not.toContain("fetch(");
    expect(source).not.toContain("createChatCompletion");
    expect(source).not.toContain("responses.create");
  });
});
