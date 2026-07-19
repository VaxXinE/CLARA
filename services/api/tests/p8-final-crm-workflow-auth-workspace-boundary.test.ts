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

const ownerHeaders = {
  "x-mock-user-id": "usr_demo_owner",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "owner",
};

describe("P8 final CRM workflow auth and workspace boundary", () => {
  it("requires auth for representative P8 read/proposal flows", async () => {
    const app = await createServer({ env: testEnv });

    const profile = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/intelligence",
    });
    const proposal = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/action-proposals/review",
      payload: { proposalType: "follow_up_task_review" },
    });

    await app.close();

    expect(profile.statusCode).toBe(401);
    expect(proposal.statusCode).toBe(401);
  });

  it("derives workspace from AuthContext instead of client input", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/intelligence?workspaceId=wks_client_spoof",
      headers: ownerHeaders,
    });
    const crossWorkspace = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_budi/intelligence",
      headers: {
        ...ownerHeaders,
        "x-mock-workspace-id": "wks_other",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().workspaceId).toBe("wks_demo_sales");
    expect(crossWorkspace.statusCode).toBe(404);
  });
});
