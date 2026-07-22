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

function authHeaders(input: {
  userId: string;
  organizationId: string;
  workspaceId: string;
  role: "owner" | "agent" | "viewer";
}) {
  return {
    "x-mock-user-id": input.userId,
    "x-mock-organization-id": input.organizationId,
    "x-mock-workspace-id": input.workspaceId,
    "x-mock-role": input.role,
  };
}

const agentHeaders = authHeaders({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("P13 conversation-to-customer linking", () => {
  it("requires authentication for customer linking", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PUT",
      url: "/api/v1/conversations/conv_demo_budi_stock/customer",
      payload: { customerId: "cust_demo_sari" },
    });

    await app.close();

    expect(response.statusCode).toBe(401);
  });

  it("lets an agent link and unlink a conversation using backend workspace scope", async () => {
    const app = await createServer({ env: testEnv });

    const linked = await app.inject({
      method: "PUT",
      url: "/api/v1/conversations/conv_demo_budi_stock/customer",
      headers: agentHeaders,
      payload: {
        customerId: "cust_demo_sari",
      },
    });

    expect(linked.statusCode).toBe(200);
    expect(linked.json()).toMatchObject({
      conversation: {
        id: "conv_demo_budi_stock",
        customer: {
          id: "cust_demo_sari",
          display_name: "Sari Wijaya",
        },
      },
      feedback: {
        status: "linked",
      },
    });

    const customerConversations = await app.inject({
      method: "GET",
      url: "/api/v1/customers/cust_demo_sari/conversations?organization_id=org_other&workspace_id=wks_other",
      headers: agentHeaders,
    });

    expect(customerConversations.statusCode).toBe(200);
    expect(
      customerConversations.json().data.map((item: { id: string }) => item.id),
    ).toContain("conv_demo_budi_stock");

    const unlinked = await app.inject({
      method: "DELETE",
      url: "/api/v1/conversations/conv_demo_budi_stock/customer",
      headers: agentHeaders,
    });

    await app.close();

    expect(unlinked.statusCode).toBe(200);
    expect(unlinked.json()).toMatchObject({
      conversation: {
        id: "conv_demo_budi_stock",
        customer: null,
      },
      feedback: {
        status: "unlinked",
      },
    });
  });

  it("blocks viewer role from mutating conversation customer links", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PUT",
      url: "/api/v1/conversations/conv_demo_budi_stock/customer",
      headers: authHeaders({
        userId: "usr_demo_viewer",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "viewer",
      }),
      payload: { customerId: "cust_demo_sari" },
    });

    await app.close();

    expect(response.statusCode).toBe(403);
  });

  it("rejects client-supplied organization, workspace, and role fields", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PUT",
      url: "/api/v1/conversations/conv_demo_budi_stock/customer",
      headers: agentHeaders,
      payload: {
        customerId: "cust_demo_sari",
        organization_id: "org_demo_other",
        workspace_id: "wks_demo_other",
        role: "owner",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(JSON.stringify(response.json())).not.toContain("token");
  });

  it("returns safe 404 for cross-workspace customer link attempts", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "PUT",
      url: "/api/v1/conversations/conv_demo_budi_stock/customer",
      headers: agentHeaders,
      payload: {
        customerId: "cust_other_workspace",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      error: {
        code: "NOT_FOUND",
      },
    });
  });
});
