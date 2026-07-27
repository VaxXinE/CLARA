import { describe, expect, it } from "vitest";
import { createP19ProviderCrmServer } from "./support/p19-real-crm-provider-server";

describe("P19 real CRM customer create/update runtime", () => {
  it("allows provider-authenticated owner and agent customer mutations", async () => {
    const { app, authHeader } = await createP19ProviderCrmServer();

    const create = await app.inject({
      method: "POST",
      url: "/api/v1/customers?workspaceId=wks_spoof",
      headers: await authHeader("subject_demo_agent"),
      payload: {
        displayName: "Internal CRM Customer",
        contactIdentifier: "internal@example.test",
        source: "extension_bridge",
        status: "new",
        notesSummary: "Safe internal CRM summary.",
      },
    });
    const created = create.json();
    const update = await app.inject({
      method: "PATCH",
      url: `/api/v1/customers/${created.customer.id}`,
      headers: await authHeader("subject_demo_owner"),
      payload: {
        displayName: "Updated Internal Customer",
        source: "email",
        status: "active",
      },
    });

    await app.close();

    expect(create.statusCode).toBe(201);
    expect(created.customer).toMatchObject({
      display_name: "Internal CRM Customer",
      source: "extension_bridge",
    });
    expect(update.statusCode).toBe(200);
    expect(update.json().customer).toMatchObject({
      display_name: "Updated Internal Customer",
      source: "email",
      status: "active",
    });
    expect(create.body + update.body).not.toContain("wks_spoof");
  });

  it("keeps provider-authenticated viewer read-only for customer mutations", async () => {
    const { app, authHeader } = await createP19ProviderCrmServer();

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/customers",
      headers: await authHeader("subject_demo_viewer"),
      payload: { displayName: "Viewer Write Attempt" },
    });

    await app.close();

    expect(response.statusCode).toBe(403);
    expect(response.body).not.toContain("raw_provider");
  });
});
