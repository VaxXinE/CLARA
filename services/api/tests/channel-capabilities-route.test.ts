import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

function authHeaders(role: "owner" | "agent" | "viewer" = "viewer") {
  return {
    "x-mock-user-id": `usr_demo_${role}`,
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": "wks_demo_sales",
    "x-mock-role": role,
  };
}

describe("GET /api/v1/channels/capabilities", () => {
  it("requires authentication", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/channels/capabilities",
    });

    await app.close();

    expect(response.statusCode).toBe(401);
  });

  it("lets viewer read safe channel capabilities", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/channels/capabilities",
      headers: authHeaders("viewer"),
    });

    await app.close();

    const body = response.json();
    const serialized = JSON.stringify(body);

    expect(response.statusCode).toBe(200);
    expect(body.data.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          provider: "gmail",
          production_status: "available",
        }),
        expect.objectContaining({
          provider: "whatsapp",
          inbound_supported: true,
          outbound_supported: false,
          production_status: "available",
        }),
        expect.objectContaining({
          provider: "instagram",
          production_status: "planned",
        }),
        expect.objectContaining({
          provider: "tiktok",
          production_status: "planned",
        }),
        expect.objectContaining({
          provider: "webchat",
          inbound_supported: true,
          production_status: "available",
        }),
      ]),
    );
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("client_secret");
    expect(serialized).not.toContain("raw_provider_config");
  });
});
