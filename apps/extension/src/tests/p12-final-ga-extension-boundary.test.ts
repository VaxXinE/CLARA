import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P12 final GA extension boundary", () => {
  it("keeps extension scoped to user-assisted active conversation sync", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
  });
});
