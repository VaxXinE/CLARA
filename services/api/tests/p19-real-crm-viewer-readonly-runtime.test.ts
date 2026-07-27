import { describe, expect, it } from "vitest";
import { createP19ProviderCrmServer } from "./support/p19-real-crm-provider-server";

describe("P19 real CRM viewer readonly runtime", () => {
  it("allows read and rejects customer workflow mutations", async () => {
    const { app, authHeader } = await createP19ProviderCrmServer();
    const headers = await authHeader("subject_demo_viewer");

    const read = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi",
      headers,
    });
    const note = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/notes",
      headers,
      payload: { body: "viewer write attempt" },
    });

    await app.close();

    expect(read.statusCode).toBe(200);
    expect(read.json().permissions.can_update_customer).toBe(false);
    expect(note.statusCode).toBe(403);
  });
});
