import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("P17 AI context no raw prompt/provider payload persistence", () => {
  it("does not add raw prompt or provider payload persistence APIs", () => {
    const source = readFileSync(
      join(process.cwd(), "src/ai/extension-snapshot-ai-context-builder.ts"),
      "utf8",
    );

    expect(source).not.toContain("persistRawPrompt");
    expect(source).not.toContain("rawProviderPayloadRepository");
    expect(source).not.toContain("rawAiProviderResponseRepository");
  });
});
