import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("P17 final AI no raw prompt/provider payload regression", () => {
  it("keeps raw prompt and raw provider payload out of analysis persistence code", () => {
    const files = [
      "src/ai/extension-snapshot-ai-analysis-types.ts",
      "src/ai/extension-snapshot-ai-analysis-repository.ts",
      "src/ai/extension-snapshot-ai-analysis-service.ts",
    ]
      .map((file) => readFileSync(join(process.cwd(), file), "utf8"))
      .join("\n");

    expect(files).not.toMatch(
      /rawPrompt|rawProviderPayload|rawProviderResponse/,
    );
  });
});
