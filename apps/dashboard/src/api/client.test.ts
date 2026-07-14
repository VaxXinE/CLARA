import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiClient } from "./client";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

function getRequestHeaders(fetchMock: ReturnType<typeof vi.fn>) {
  const init = fetchMock.mock.calls[0]?.[1];

  expect(init).toBeDefined();

  return ((init as RequestInit).headers ?? {}) as Record<string, string>;
}

describe("ApiClient auth headers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("attaches mock auth headers in demo mode", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        user: {
          id: "usr_demo_agent",
          role: "agent",
        },
        organization: {
          id: "org_demo",
        },
        workspace: {
          id: "wks_demo_sales",
        },
        permissions: [],
        auth: {
          method: "mock",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
      demoAuthProfile: {
        label: "Agent",
        role: "agent",
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
    });

    await client.getMe();

    const headers = getRequestHeaders(fetchMock);

    expect(headers["x-mock-user-id"]).toBe("usr_demo_agent");
    expect(headers.authorization).toBeUndefined();
  });

  it("attaches Authorization header only when a provider access token exists", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        user: {
          id: "usr_demo_agent",
          role: "agent",
        },
        organization: {
          id: "org_demo",
        },
        workspace: {
          id: "wks_demo_sales",
        },
        permissions: [],
        auth: {
          method: "provider",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
      getAccessToken: async () => "provider-access-token",
    });

    await client.getMe();

    const headers = getRequestHeaders(fetchMock);

    expect(headers.authorization).toBe("Bearer provider-access-token");
    expect(headers["x-mock-user-id"]).toBeUndefined();
    expect(headers["x-mock-organization-id"]).toBeUndefined();
    expect(headers["x-mock-workspace-id"]).toBeUndefined();
    expect(headers["x-mock-role"]).toBeUndefined();
  });

  it("does not attach fake bearer headers when the token provider returns empty", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        user: {
          id: "usr_demo_agent",
          role: "agent",
        },
        organization: {
          id: "org_demo",
        },
        workspace: {
          id: "wks_demo_sales",
        },
        permissions: [],
        auth: {
          method: "provider",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
      getAccessToken: async () => "   ",
    });

    await client.getMe();

    const headers = getRequestHeaders(fetchMock);

    expect(headers.authorization).toBeUndefined();
  });

  it("loads Gmail scheduler status safely", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          scheduler_enabled: false,
          scheduler_running: false,
          interval_ms: 300000,
          max_accounts_per_tick: 10,
          max_messages_per_account: 25,
          last_reason_code: "runtime_disabled",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response = await client.getGmailSchedulerStatus();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/integrations/gmail/scheduler/status",
      expect.any(Object),
    );
    expect(response.data).toMatchObject({
      scheduler_enabled: false,
      last_reason_code: "runtime_disabled",
    });
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
  });

  it("loads Gmail outbound delivery status safely", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          outbound_delivery_id: "email_outbound_demo",
          provider: "gmail",
          status: "simulated",
          reason_code: "simulated_send_completed",
          provider_message_id: "gmail_msg_demo",
          conversation_id: "conv_demo",
          created_at: "2026-01-01T00:00:00.000Z",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response = await client.getGmailOutboundDeliveryStatus(
      "email_outbound_demo",
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/integrations/gmail/outbound/deliveries/email_outbound_demo",
      expect.any(Object),
    );
    expect(response.data).toMatchObject({
      provider: "gmail",
      status: "simulated",
    });
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
  });

  it("loads Webchat outbound delivery status safely", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          outbound_delivery_id: "webchat_outbound_demo",
          provider: "webchat",
          status: "simulated",
          reason_code: "simulated_send_completed",
          provider_message_id: "webchat_msg_demo",
          conversation_id: "conv_demo",
          channel_account_id: "channel_account_demo_webchat",
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: "2026-01-01T00:00:00.000Z",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new ApiClient({
      baseUrl: "http://127.0.0.1:3000",
    });

    const response = await client.getWebchatOutboundDeliveryStatus(
      "webchat_outbound_demo",
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/v1/integrations/webchat/outbound/deliveries/webchat_outbound_demo",
      expect.any(Object),
    );
    expect(response.data).toMatchObject({
      provider: "webchat",
      status: "simulated",
    });
    expect(JSON.stringify(response)).not.toContain("access_token");
    expect(JSON.stringify(response)).not.toContain("refresh_token");
    expect(JSON.stringify(response)).not.toContain("Authorization");
    expect(JSON.stringify(response)).not.toContain("raw_provider");
  });
});
