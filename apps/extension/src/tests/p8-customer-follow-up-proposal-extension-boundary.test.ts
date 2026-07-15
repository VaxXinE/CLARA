import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P8 customer follow-up proposal extension boundary", () => {
  it("does not add task creation or follow-up execution capability to the extension", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
    expect("customerFollowUpProposal" in extensionBackground).toBe(false);
    expect("executeFollowUpProposal" in extensionBackground).toBe(false);
    expect("autoCreateTask" in extensionBackground).toBe(false);
    expect("autoScheduleTask" in extensionBackground).toBe(false);
    expect("autoSendOutboundMessage" in extensionBackground).toBe(false);
  });
});
