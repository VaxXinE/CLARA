import { describe, expect, it, vi } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P13 customer notes extension boundary", () => {
  it("does not expose customer notes or timeline methods to the extension", () => {
    const client = new ClaraExtensionApiClient({
      baseUrl: "http://127.0.0.1:3000",
      accessToken: async () => "atk",
      fetchImpl: vi.fn(),
    });
    const shape = client as unknown as Record<string, unknown>;

    expect(shape.listCustomerNotes).toBeUndefined();
    expect(shape.createCustomerNote).toBeUndefined();
    expect(shape.listCustomerActivityTimeline).toBeUndefined();
    expect(shape.createCustomer).toBeUndefined();
    expect(shape.updateCustomer).toBeUndefined();
  });
});
