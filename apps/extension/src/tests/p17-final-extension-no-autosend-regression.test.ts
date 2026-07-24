import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P17 final extension no autosend regression", () => {
  it("keeps capture active-chat only and send mode manual-assisted", () => {
    expect(extensionBackground.syncScope).toBe("active_conversation_only");
    expect(extensionBackground.sendMode).toBe("manual_assisted");
    expect("autoSend" in extensionBackground).toBe(false);
    expect("backgroundCrawler" in extensionBackground).toBe(false);
  });
});
