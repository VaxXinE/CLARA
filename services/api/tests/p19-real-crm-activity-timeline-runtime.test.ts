import { describe, expect, it } from "vitest";
import { createP19ProviderCrmServer } from "./support/p19-real-crm-provider-server";

describe("P19 real CRM activity timeline runtime", () => {
  it("returns safe workspace-scoped CRM timeline events", async () => {
    const { app, authHeader } = await createP19ProviderCrmServer();
    const headers = await authHeader("subject_demo_agent");

    await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/notes",
      headers,
      payload: { body: "Timeline note body should not appear in summary." },
    });
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/activity",
      headers,
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "customer.note.created" }),
      ]),
    );
    expect(response.body).not.toContain("Timeline note body should not appear");
    expect(response.body).not.toContain("access_token");
  });
});
