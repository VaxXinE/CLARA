import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";
import { buildAuthContext } from "../src/auth/auth-context";
import { validateInternalCustomerImport } from "../src/customers/internal-data-import-policy";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

const agentHeaders = {
  "x-mock-user-id": "usr_demo_agent",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "agent",
};

describe("P14 internal access client workspace spoofing", () => {
  it("rejects workspace spoofing in CRM route payloads and import policy", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/customers/cust_demo_budi",
      headers: agentHeaders,
      payload: {
        displayName: "Spoofed Workspace",
        workspace_id: "wks_demo_other",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(() =>
      validateInternalCustomerImport(
        buildAuthContext({
          userId: "usr_demo_agent",
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
          role: "agent",
        }),
        { displayName: "Import Spoof", workspaceId: "wks_demo_other" },
      ),
    ).toThrow("Invalid import scope.");
  });
});
