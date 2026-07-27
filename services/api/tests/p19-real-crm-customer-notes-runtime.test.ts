import { describe, expect, it } from "vitest";
import { createP19ProviderCrmServer } from "./support/p19-real-crm-provider-server";

describe("P19 real CRM customer notes runtime", () => {
  it("creates workspace-scoped notes from backend AuthContext only", async () => {
    const { app, authHeader } = await createP19ProviderCrmServer();

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/notes?workspaceId=wks_spoof",
      headers: await authHeader("subject_demo_agent"),
      payload: { body: "Safe real CRM note." },
    });

    await app.close();

    expect(response.statusCode).toBe(201);
    expect(response.json().note).toMatchObject({
      customer_id: "cust_demo_budi",
      author_user_id: "usr_demo_agent",
      body: "Safe real CRM note.",
    });
    expect(response.body).not.toContain("wks_spoof");
  });
});
