import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P8 customer lifecycle status readiness extension boundary", () => {
  it("does not add lifecycle/status readiness or CRM mutation capability to the extension", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
    expect("customerLifecycleStatusReadiness" in extensionBackground).toBe(
      false,
    );
    expect("executeLifecycleStatusReadiness" in extensionBackground).toBe(
      false,
    );
    expect("updateCustomerLifecycle" in extensionBackground).toBe(false);
    expect("updateCustomerStatus" in extensionBackground).toBe(false);
    expect("crmMutationCapability" in extensionBackground).toBe(false);
  });
});
