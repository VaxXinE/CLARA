import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P13 final internal CRM extension boundary", () => {
  it("keeps extension API free of internal CRM mutation and analytics controls", () => {
    const methods = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methods).not.toContain("createCustomer");
    expect(methods).not.toContain("updateCustomer");
    expect(methods).not.toContain("createCustomerNote");
    expect(methods).not.toContain("assignCustomerOwner");
    expect(methods).not.toContain("createFollowUpTask");
    expect(methods).not.toContain("linkConversationToCustomer");
    expect(methods).not.toContain("getInternalCrmDashboardAnalytics");
  });
});
