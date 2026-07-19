import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P8 customer owner assignment readiness extension boundary", () => {
  it("does not add owner assignment or CRM workflow execution capability to the extension", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
    expect("customerOwnerAssignmentReadiness" in extensionBackground).toBe(
      false,
    );
    expect("executeOwnerAssignment" in extensionBackground).toBe(false);
    expect("changeCustomerOwner" in extensionBackground).toBe(false);
    expect("crmMutationCapability" in extensionBackground).toBe(false);
  });
});
