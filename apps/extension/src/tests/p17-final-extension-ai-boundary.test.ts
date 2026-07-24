import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P17 final extension AI boundary", () => {
  it("does not call AI providers or build final backend prompts", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
    expect("aiProviderApiKey" in extensionBackground).toBe(false);
    expect("finalAiPrompt" in extensionBackground).toBe(false);
  });
});
