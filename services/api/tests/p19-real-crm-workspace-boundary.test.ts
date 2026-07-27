import { describe, expect, it } from "vitest";
import { createP19ProviderCrmServer } from "./support/p19-real-crm-provider-server";

describe("P19 real CRM workspace boundary", () => {
  it("fails closed for missing/inactive membership and rejects cross-workspace access", async () => {
    const { app, authHeader } = await createP19ProviderCrmServer();

    const missing = await app.inject({
      method: "GET",
      url: "/api/v1/customers",
      headers: await authHeader("subject_demo_no_membership"),
    });
    const inactive = await app.inject({
      method: "GET",
      url: "/api/v1/customers",
      headers: await authHeader("subject_demo_inactive_membership"),
    });
    const crossWorkspace = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_other_workspace",
      headers: await authHeader("subject_demo_agent"),
    });

    await app.close();

    expect(missing.statusCode).toBe(403);
    expect(inactive.statusCode).toBe(403);
    expect(crossWorkspace.statusCode).toBe(404);
    expect(missing.body + inactive.body + crossWorkspace.body).not.toContain(
      "raw_provider",
    );
  });
});
