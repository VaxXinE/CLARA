import { describe, expect, it } from "vitest";
import { createP19ProviderCrmServer } from "./support/p19-real-crm-provider-server";

describe("P19 real CRM conversation customer linking runtime", () => {
  it("links and unlinks explicitly within provider workspace scope", async () => {
    const { app, authHeader } = await createP19ProviderCrmServer();
    const headers = await authHeader("subject_demo_agent");

    const link = await app.inject({
      method: "PUT",
      url: "/api/v1/conversations/conv_demo_budi_stock/customer",
      headers,
      payload: { customerId: "cust_demo_sari" },
    });
    const unlink = await app.inject({
      method: "DELETE",
      url: "/api/v1/conversations/conv_demo_budi_stock/customer",
      headers,
    });

    await app.close();

    expect(link.statusCode).toBe(200);
    expect(link.json().conversation.customer.id).toBe("cust_demo_sari");
    expect(unlink.statusCode).toBe(200);
    expect(unlink.json().conversation.customer).toBeNull();
  });
});
