import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("P17 real AI analysis raw prompt/provider payload persistence", () => {
  it("keeps raw prompt and provider payload out of repository shape", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/ai/extension-snapshot-ai-analysis-repository.ts",
      ),
      "utf8",
    );

    expect(source).not.toMatch(/rawPrompt|rawProviderPayload|rawAiResponse/);
  });
});
