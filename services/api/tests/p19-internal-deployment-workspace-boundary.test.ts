import { describe, expect, it } from "vitest";
import { createP19ProviderCrmServer } from "./support/p19-real-crm-provider-server";

describe("P19 internal deployment workspace boundary", () => {
  it("keeps membership authoritative and ignores client workspace spoofing", async () => {
    const { app, authHeader } = await createP19ProviderCrmServer();

    const missing = await app.inject({
      method: "GET",
      url: "/api/v1/customers?workspace_id=workspace_demo",
      headers: await authHeader("subject_demo_no_membership"),
    });
    const spoofed = await app.inject({
      method: "POST",
      url: "/api/v1/customers?workspace_id=evil_workspace",
      headers: await authHeader("subject_demo_agent"),
      payload: {
        displayName: "Internal customer",
        contactIdentifier: "internal@example.test",
      },
    });

    await app.close();

    expect(missing.statusCode).toBe(403);
    expect(spoofed.statusCode).toBe(201);
    expect(spoofed.body).not.toContain("evil_workspace");
  });
});
