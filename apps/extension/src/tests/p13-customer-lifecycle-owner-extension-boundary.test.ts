import { describe, expect, it, vi } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P13 customer lifecycle and owner assignment extension boundary", () => {
  it("does not expose lifecycle status or owner assignment mutation methods", () => {
    const client = new ClaraExtensionApiClient({
      baseUrl: "http://127.0.0.1:3000",
      accessToken: async () => "atk",
      fetchImpl: vi.fn(),
    });
    const shape = client as unknown as Record<string, unknown>;

    expect(shape.updateCustomerLifecycleStatus).toBeUndefined();
    expect(shape.assignCustomerOwner).toBeUndefined();
    expect(shape.listWorkspaceMembers).toBeUndefined();
    expect(shape.createCustomer).toBeUndefined();
    expect(shape.updateCustomer).toBeUndefined();
  });
});
