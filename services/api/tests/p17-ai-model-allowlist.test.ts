import { describe, expect, it } from "vitest";
import { isAiModelAllowed } from "../src/ai/ai-model-allowlist";

describe("P17 AI model allowlist", () => {
  it("allows only configured model names", () => {
    expect(isAiModelAllowed({ model: "model-a", allowlist: ["model-a"] })).toBe(
      true,
    );
    expect(isAiModelAllowed({ model: "model-b", allowlist: ["model-a"] })).toBe(
      false,
    );
  });
});
