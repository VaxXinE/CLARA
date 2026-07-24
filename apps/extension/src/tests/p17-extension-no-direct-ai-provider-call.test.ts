import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P17 extension no direct AI provider call", () => {
  it("does not add direct AI provider powers or auto-send", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
    expect("autoSend" in extensionBackground).toBe(false);
    expect("aiProviderApiKey" in extensionBackground).toBe(false);
  });
});
