import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P8 CRM extension boundary", () => {
  it("keeps extension CRM workflow handoff manual", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
  });

  it("does not add extension-side CRM mutation automation", () => {
    expect("crmMutationMode" in extensionBackground).toBe(false);
    expect("autoCreateTask" in extensionBackground).toBe(false);
    expect("autoWriteCustomerNote" in extensionBackground).toBe(false);
    expect("accessToken" in extensionBackground).toBe(false);
    expect("refreshToken" in extensionBackground).toBe(false);
  });
});
