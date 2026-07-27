import { describe, expect, it } from "vitest";
import { createP19ProviderCrmServer } from "./support/p19-real-crm-provider-server";

describe("P19 real CRM lifecycle and owner runtime", () => {
  it("updates lifecycle and assigns only active workspace members", async () => {
    const { app, authHeader } = await createP19ProviderCrmServer();
    const headers = await authHeader("subject_demo_owner");

    const status = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/lifecycle-status",
      headers,
      payload: { status: "follow_up" },
    });
    const owner = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/owner-assignment",
      headers,
      payload: { ownerUserId: "usr_demo_agent" },
    });
    const inactive = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi/owner-assignment",
      headers,
      payload: { ownerUserId: "usr_demo_inactive_membership" },
    });

    await app.close();

    expect(status.statusCode).toBe(200);
    expect(status.json().customer.status).toBe("follow_up");
    expect(owner.statusCode).toBe(200);
    expect(owner.json().customer.owner_user_id).toBe("usr_demo_agent");
    expect(inactive.statusCode).toBe(400);
    expect(inactive.json().error.message).toBe("Invalid customer owner input.");
  });
});
