import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import type {
  ActivityResponse,
  ConversationDetailResponse,
  ConversationListResponse,
  CustomerProfileResponse,
  MeResponse,
} from "./api/types";
import type { DashboardAuthClient } from "./auth/supabase-auth-client";

const conversationListResponse: ConversationListResponse = {
  data: [
    {
      id: "conv_demo_budi_stock",
      source: "whatsapp",
      status: "open",
      snippet: "Need help with my order",
      last_message_at: "2026-01-01T00:00:00.000Z",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
      customer: {
        id: "cust_demo_budi",
        display_name: "Budi",
        source: "whatsapp",
        status: "active",
      },
      assigned_user: {
        id: "usr_demo_agent",
        display_name: "Agent Demo",
      },
    },
  ],
  pagination: {
    limit: 20,
    next_cursor: null,
  },
  permissions: {
    can_view_conversation: true,
    can_view_customer_profile: true,
    can_view_activity: true,
    can_generate_ai_draft: true,
    can_send_reply: true,
  },
};

const conversationDetailResponse: ConversationDetailResponse = {
  conversation: {
    id: "conv_demo_budi_stock",
    source: "whatsapp",
    status: "open",
    last_message_at: "2026-01-01T00:00:00.000Z",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    customer: {
      id: "cust_demo_budi",
      display_name: "Budi",
      source: "whatsapp",
      status: "active",
    },
    assigned_user: {
      id: "usr_demo_agent",
      display_name: "Agent Demo",
    },
    messages: [
      {
        id: "msg_demo_in_001",
        direction: "inbound",
        sender_type: "customer",
        sender_user_id: null,
        body: "Need help with my order",
        sent_at: "2026-01-01T00:00:00.000Z",
        delivery_status: "received",
        created_at: "2026-01-01T00:00:00.000Z",
      },
    ],
  },
  permissions: {
    can_view_conversation: true,
    can_view_customer_profile: true,
    can_view_activity: true,
    can_generate_ai_draft: true,
    can_send_reply: true,
  },
};

const customerResponse: CustomerProfileResponse = {
  customer: {
    id: "cust_demo_budi",
    display_name: "Budi",
    contact_identifier: "budi-demo-contact",
    source: "whatsapp",
    status: "active",
    notes_summary: "Demo customer only.",
    last_interaction_at: "2026-01-01T00:00:00.000Z",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  permissions: {
    can_view_conversation: true,
    can_view_customer_profile: true,
    can_view_activity: true,
    can_generate_ai_draft: true,
    can_send_reply: true,
  },
};

const activityResponse: ActivityResponse = {
  data: {
    conversation_id: "conv_demo_budi_stock",
    items: [
      {
        id: "activity_demo_001",
        type: "conversation.created",
        title: "Conversation created",
        description: "Conversation was created from safe demo data.",
        actor: {
          type: "system",
          id: null,
          name: "System",
        },
        created_at: "2026-01-01T00:00:00.000Z",
      },
    ],
  },
};

const gmailSchedulerStatusResponse = {
  data: {
    scheduler_enabled: true,
    scheduler_running: true,
    interval_ms: 300000,
    max_accounts_per_tick: 10,
    max_messages_per_account: 25,
    last_tick_status: "completed",
  },
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

function meResponse(input: {
  role: "owner" | "agent" | "viewer";
  method: "mock" | "provider";
}): MeResponse {
  return {
    user: {
      id:
        input.role === "owner"
          ? "usr_demo_owner"
          : input.role === "agent"
            ? "usr_demo_agent"
            : "usr_demo_viewer",
      role: input.role,
    },
    organization: {
      id: "org_demo",
    },
    workspace: {
      id: "wks_demo_sales",
    },
    permissions: [],
    auth: {
      method: input.method,
    },
  };
}

function createMockAuthClient(
  session: {
    accessToken: string;
    userId: string;
    email: string | null;
  } | null,
): DashboardAuthClient {
  return {
    getSession: vi.fn(async () => session),
    signIn: vi.fn(async () => {}),
    signOut: vi.fn(async () => {}),
    subscribe: vi.fn(() => () => {}),
  };
}

describe("App", () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
        removeItem: (key: string) => {
          storage.delete(key);
        },
        clear: () => {
          storage.clear();
        },
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("keeps viewer in read-only mode during demo auth", async () => {
    window.localStorage.setItem("clara-dashboard-demo-role", "viewer");

    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes("/api/v1/me")) {
        return jsonResponse(meResponse({ role: "viewer", method: "mock" }));
      }

      if (url.includes("/api/v1/conversations/conv_demo_budi_stock/activity")) {
        return jsonResponse(activityResponse);
      }

      if (url.includes("/api/v1/conversations/conv_demo_budi_stock")) {
        return jsonResponse({
          ...conversationDetailResponse,
          permissions: {
            ...conversationDetailResponse.permissions,
            can_generate_ai_draft: false,
            can_send_reply: false,
          },
        } satisfies ConversationDetailResponse);
      }

      if (url.includes("/api/v1/customers/cust_demo_budi")) {
        return jsonResponse(customerResponse);
      }

      if (url.includes("/api/v1/conversations")) {
        return jsonResponse({
          ...conversationListResponse,
          permissions: {
            ...conversationListResponse.permissions,
            can_generate_ai_draft: false,
            can_send_reply: false,
          },
        } satisfies ConversationListResponse);
      }

      throw new Error(`Unhandled request in test: ${url}`);
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<App authConfig={{ mode: "demo" }} />);

    expect(await screen.findByText("View-only access")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Generate AI Draft" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Send Reply" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Workspace: wks_demo_sales/)).toBeInTheDocument();
    expect(screen.getByText(/usr_demo_viewer/)).toBeInTheDocument();
    expect(screen.getByText("Follow-up workspace preview")).toBeInTheDocument();
    expect(screen.getByText("Access Control")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Access changes disabled" }),
    ).toBeDisabled();
  });

  it("renders a login shell in provider mode when no session exists", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(
      <App
        authConfig={{
          mode: "provider",
          provider: "supabase",
          supabaseUrl: "https://example.supabase.test",
          supabaseAnonKey: "example-anon-key",
        }}
        authClient={createMockAuthClient(null)}
      />,
    );

    expect(
      await screen.findByRole("heading", { name: "Sign in to CLARA" }),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("loads workspace data in provider mode when a session exists", async () => {
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const headers = (init?.headers ?? {}) as Record<string, string>;

        expect(headers.authorization).toBe("Bearer provider-session-token");

        if (url.includes("/api/v1/me")) {
          return jsonResponse(
            meResponse({ role: "agent", method: "provider" }),
          );
        }

        if (url.includes("/api/v1/integrations/gmail/scheduler/status")) {
          return jsonResponse(gmailSchedulerStatusResponse);
        }

        if (
          url.includes("/api/v1/conversations/conv_demo_budi_stock/activity")
        ) {
          return jsonResponse(activityResponse);
        }

        if (url.includes("/api/v1/conversations/conv_demo_budi_stock")) {
          return jsonResponse(conversationDetailResponse);
        }

        if (url.includes("/api/v1/customers/cust_demo_budi")) {
          return jsonResponse(customerResponse);
        }

        if (url.includes("/api/v1/conversations")) {
          return jsonResponse(conversationListResponse);
        }

        throw new Error(`Unhandled request in test: ${url}`);
      },
    );

    vi.stubGlobal("fetch", fetchMock);

    render(
      <App
        authConfig={{
          mode: "provider",
          provider: "supabase",
          supabaseUrl: "https://example.supabase.test",
          supabaseAnonKey: "example-anon-key",
        }}
        authClient={createMockAuthClient({
          accessToken: "provider-session-token",
          userId: "provider-user-001",
          email: "agent@example.test",
        })}
      />,
    );

    expect(
      await screen.findByText(/Workspace: wks_demo_sales/),
    ).toBeInTheDocument();
    expect(screen.getByText(/usr_demo_agent/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log Out" })).toBeInTheDocument();
    expect(screen.getByText("Gmail scheduler")).toBeInTheDocument();
    expect(screen.getByText("completed")).toBeInTheDocument();
    expect(screen.getAllByText("WhatsApp").length).toBeGreaterThan(0);
  });

  it("submits provider login from the login shell", async () => {
    const signIn = vi.fn(async () => {});
    const authClient: DashboardAuthClient = {
      getSession: vi.fn(async () => null),
      signIn,
      signOut: vi.fn(async () => {}),
      subscribe: vi.fn(() => () => {}),
    };

    render(
      <App
        authConfig={{
          mode: "provider",
          provider: "supabase",
          supabaseUrl: "https://example.supabase.test",
          supabaseAnonKey: "example-anon-key",
        }}
        authClient={authClient}
      />,
    );

    await screen.findByRole("heading", { name: "Sign in to CLARA" });

    await userEvent.clear(screen.getByLabelText("Email"));
    await userEvent.type(screen.getByLabelText("Email"), "agent@example.test");
    await userEvent.type(screen.getByLabelText("Password"), "secret-password");
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith({
        email: "agent@example.test",
        password: "secret-password",
      });
    });
  });
});
