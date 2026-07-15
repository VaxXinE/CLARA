import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P8 customer action proposal extension boundary", () => {
  it("does not add CRM proposal execution capability to the extension", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
    expect("customerActionProposal" in extensionBackground).toBe(false);
    expect("executeCrmProposal" in extensionBackground).toBe(false);
    expect("autoCreateTask" in extensionBackground).toBe(false);
    expect("autoWriteCustomerNote" in extensionBackground).toBe(false);
    expect("autoAssignOwner" in extensionBackground).toBe(false);
    expect("autoChangeLifecycle" in extensionBackground).toBe(false);
    expect("autoChangeStatus" in extensionBackground).toBe(false);
  });
});
