import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "../../../");

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

describe("P7 final AI no-provider-call regression", () => {
  it("does not add real LLM SDK dependencies", () => {
    const apiPackage = readFileSync(
      join(root, "services/api/package.json"),
      "utf8",
    );

    expect(apiPackage).not.toMatch(/"openai"/i);
    expect(apiPackage).not.toMatch(/"@google\/generative-ai"/i);
    expect(apiPackage).not.toMatch(/"@anthropic-ai\/sdk"/i);
  });

  it("keeps P7 AI source free of real LLM network calls", () => {
    const aiSource = listFiles(join(root, "services/api/src/ai"))
      .filter((path) => path.endsWith(".ts"))
      .filter((path) => !path.endsWith("real-ai-analysis-provider.ts"))
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");

    expect(aiSource).not.toContain("api.openai.com");
    expect(aiSource).not.toContain("generativelanguage.googleapis.com");
    expect(aiSource).not.toContain("anthropic.com");
    expect(aiSource).not.toMatch(/from ["']openai["']/i);
    expect(aiSource).not.toMatch(/from ["']@google\/generative-ai["']/i);
    expect(aiSource).not.toMatch(/from ["']@anthropic-ai\/sdk["']/i);
    expect(aiSource).toContain("MockAiReplySuggestionProvider");
  });
});
