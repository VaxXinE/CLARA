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

const body = {
  proposalType: "follow_up_task_review",
  source: "operator",
  operatorInstruction: "Review next safe step.",
  suggestedPayload: {
    priority: "normal",
  },
  clientWorkspaceId: "ignored_client_workspace",
};

describe("P8 customer action proposal route", () => {
  it("requires auth and returns proposal-only CRM action review", async () => {
    const app = await createServer({ env: testEnv });

    const unauthenticated = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/action-proposals/review",
      payload: body,
    });
    const authenticated = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/action-proposals/review",
      headers: ownerHeaders,
      payload: body,
    });

    await app.close();

    expect(unauthenticated.statusCode).toBe(401);
    expect(authenticated.statusCode).toBe(200);
    expect(authenticated.json()).toMatchObject({
      customerId: "cust_demo_budi",
      workspaceId: "wks_demo_sales",
      proposedAction: {
        executionStatus: "review_only",
        mutationExecuted: false,
      },
      safety: {
        proposalOnly: true,
        actionExecuted: false,
      },
    });
  });

  it("rejects unknown proposal types and blocks cross-workspace customer access", async () => {
    const app = await createServer({ env: testEnv });

    const unknownType = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/action-proposals/review",
      headers: ownerHeaders,
      payload: {
        ...body,
        proposalType: "execute_now",
      },
    });
    const crossWorkspace = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/action-proposals/review",
      headers: {
        ...ownerHeaders,
        "x-mock-workspace-id": "wks_other",
      },
      payload: body,
    });

    await app.close();

    expect(unknownType.statusCode).toBe(400);
    expect(crossWorkspace.statusCode).toBe(404);
  });
});
