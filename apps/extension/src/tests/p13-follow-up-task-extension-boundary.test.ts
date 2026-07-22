import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P13 follow-up task extension boundary", () => {
  it("does not expose follow-up task mutation methods", () => {
    const client = new ClaraExtensionApiClient({
      baseUrl: "http://127.0.0.1:3000",
      accessToken: async () => null,
    }) as unknown as Record<string, unknown>;

    expect(client.createCustomerFollowUpTask).toBeUndefined();
    expect(client.updateCustomerFollowUpTaskStatus).toBeUndefined();
    expect(client.assignCustomerOwner).toBeUndefined();
  });
});
