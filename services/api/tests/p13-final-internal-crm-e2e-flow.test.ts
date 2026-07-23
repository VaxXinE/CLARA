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

const agentHeaders = {
  "x-mock-user-id": "usr_demo_agent",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "agent",
};

const ownerHeaders = {
  ...agentHeaders,
  "x-mock-user-id": "usr_demo_owner",
  "x-mock-role": "owner",
};

describe("P13 final internal CRM E2E flow", () => {
  it("covers customer, note, timeline, lifecycle, owner, task, link, and analytics flow", async () => {
    const app = await createServer({ env: testEnv });

    const customerList = await app.inject({
      method: "GET",
      url: "/api/v1/customers",
      headers: agentHeaders,
    });
    const created = await app.inject({
      method: "POST",
      url: "/api/v1/customers",
      headers: agentHeaders,
      payload: {
        displayName: "P13 Final CRM Lead",
        contactIdentifier: "p13-final@example.test",
        source: "email",
        status: "new",
      },
    });
    const customerId = created.json().customer.id as string;
    const updated = await app.inject({
      method: "PATCH",
      url: `/api/v1/customers/${customerId}`,
      headers: agentHeaders,
      payload: { displayName: "P13 Final CRM Customer", status: "active" },
    });
    const note = await app.inject({
      method: "POST",
      url: `/api/v1/customers/${customerId}/notes`,
      headers: agentHeaders,
      payload: { body: "Safe internal CRM QA note." },
    });
    const timeline = await app.inject({
      method: "GET",
      url: `/api/v1/customers/${customerId}/activity`,
      headers: agentHeaders,
    });
    const lifecycle = await app.inject({
      method: "PATCH",
      url: `/api/v1/customers/${customerId}/lifecycle-status`,
      headers: agentHeaders,
      payload: { status: "follow_up" },
    });
    const owner = await app.inject({
      method: "PATCH",
      url: `/api/v1/customers/${customerId}/owner-assignment`,
      headers: ownerHeaders,
      payload: { ownerUserId: "usr_demo_agent" },
    });
    const task = await app.inject({
      method: "POST",
      url: `/api/v1/customers/${customerId}/tasks`,
      headers: agentHeaders,
      payload: {
        title: "P13 final follow-up",
        body: "Check internal CRM QA result.",
        dueAt: "2030-01-02",
        assigneeUserId: "usr_demo_agent",
      },
    });
    const taskUpdate = await app.inject({
      method: "PATCH",
      url: `/api/v1/customers/${customerId}/tasks/${task.json().task.id}`,
      headers: agentHeaders,
      payload: { status: "completed" },
    });
    const link = await app.inject({
      method: "PUT",
      url: "/api/v1/conversations/conv_demo_budi_stock/customer",
      headers: agentHeaders,
      payload: { customerId },
    });
    const customerConversations = await app.inject({
      method: "GET",
      url: `/api/v1/customers/${customerId}/conversations`,
      headers: agentHeaders,
    });
    const conversation = await app.inject({
      method: "GET",
      url: "/api/v1/conversations/conv_demo_budi_stock",
      headers: agentHeaders,
    });
    const analytics = await app.inject({
      method: "GET",
      url: "/api/v1/analytics/internal-crm-dashboard",
      headers: ownerHeaders,
    });

    await app.close();

    expect(customerList.statusCode).toBe(200);
    expect(created.statusCode).toBe(201);
    expect(updated.statusCode).toBe(200);
    expect(note.statusCode).toBe(201);
    expect(timeline.statusCode).toBe(200);
    expect(lifecycle.statusCode).toBe(200);
    expect(owner.statusCode).toBe(200);
    expect(task.statusCode).toBe(201);
    expect(taskUpdate.statusCode).toBe(200);
    expect(link.statusCode).toBe(200);
    expect(customerConversations.statusCode).toBe(200);
    expect(conversation.statusCode).toBe(200);
    expect(analytics.statusCode).toBe(200);

    expect(timeline.json().data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ customer_id: customerId }),
      ]),
    );
    expect(conversation.json().conversation.customer).toMatchObject({
      id: customerId,
      display_name: "P13 Final CRM Customer",
    });
    expect(customerConversations.json().data[0]).toMatchObject({
      id: "conv_demo_budi_stock",
      customer: { id: customerId },
    });
    expect(analytics.json()).toMatchObject({
      safety: {
        aggregated: true,
        workspaceScoped: true,
        billingPaymentIncluded: false,
        providerAiOutboundIncluded: false,
        heavyAnalyticsJobCreated: false,
        exportCreated: false,
      },
    });
  });
});
