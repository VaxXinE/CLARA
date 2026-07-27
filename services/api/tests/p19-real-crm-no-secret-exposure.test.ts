import { describe, expect, it } from "vitest";
import { createP19ProviderCrmServer } from "./support/p19-real-crm-provider-server";

describe("P19 real CRM no secret exposure", () => {
  it("keeps CRM workflow responses free of token and provider internals", async () => {
    const { app, authHeader } = await createP19ProviderCrmServer();
    const headers = await authHeader("subject_demo_agent");

    const responses = await Promise.all([
      app.inject({ method: "GET", url: "/api/v1/customers", headers }),
      app.inject({
        method: "POST",
        url: "/api/v1/customers",
        headers,
        payload: { displayName: "Safe Customer" },
      }),
      app.inject({
        method: "GET",
        url: "/api/v1/customers/cust_demo_budi/activity",
        headers,
      }),
    ]);
    const serialized = responses.map((response) => response.body).join("\n");

    await app.close();

    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("client_secret");
    expect(serialized).not.toContain("raw_provider");
  });
});
