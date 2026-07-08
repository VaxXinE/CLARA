import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import type {
  ActivityResponse,
  AiDraftResponse,
  ConversationDetailResponse,
  ConversationListResponse,
  CustomerProfileResponse,
  MeResponse,
  ReplySendResponse,
} from "./api/types";

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

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

function meResponse(role: "owner" | "agent" | "viewer"): MeResponse {
  return {
    user: {
      id:
        role === "owner"
          ? "usr_demo_owner"
          : role === "agent"
            ? "usr_demo_agent"
            : "usr_demo_viewer",
      role,
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
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("hides draft and send controls for viewer role in demo mode", async () => {
    window.localStorage.setItem("clara-dashboard-demo-role", "viewer");

    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes("/api/v1/me")) {
        return jsonResponse(meResponse("viewer"));
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

    render(<App />);

    expect(await screen.findByText("View-only access")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Generate AI Draft" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Send Reply" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Workspace: wks_demo_sales/)).toBeInTheDocument();
    expect(screen.getByText(/usr_demo_viewer/)).toBeInTheDocument();
  });

  it("labels AI output as a draft and only sends after explicit click", async () => {
    window.localStorage.setItem("clara-dashboard-demo-role", "agent");

    const replyCalls: string[] = [];
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? "GET";

        if (url.includes("/api/v1/me")) {
          return jsonResponse(meResponse("agent"));
        }

        if (
          method === "POST" &&
          url.includes("/api/v1/conversations/conv_demo_budi_stock/ai-draft")
        ) {
          const body: AiDraftResponse = {
            data: {
              draft: {
                id: "draft_demo_new",
                conversation_id: "conv_demo_budi_stock",
                body: "Hi Budi, thanks for reaching out.",
                status: "draft",
                requires_human_review: true,
                created_at: "2026-01-01T00:00:00.000Z",
              },
              ai: {
                provider: "mock",
                model: "mock-clara-draft-v1",
              },
            },
          };

          return jsonResponse(body, 201);
        }

        if (
          method === "POST" &&
          url.includes("/api/v1/conversations/conv_demo_budi_stock/reply")
        ) {
          replyCalls.push(url);

          const body: ReplySendResponse = {
            data: {
              message: {
                id: "msg_demo_out_001",
                conversation_id: "conv_demo_budi_stock",
                direction: "outbound",
                body: "Hi Budi, thanks for reaching out.",
                sender: {
                  type: "user",
                  id: "usr_demo_agent",
                  name: "Agent Demo",
                },
                created_at: "2026-01-01T00:01:00.000Z",
              },
              send: {
                provider: "simulated",
                status: "sent",
              },
            },
          };

          return jsonResponse(body, 201);
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

        throw new Error(`Unhandled request in test: ${method} ${url}`);
      },
    );

    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<App />);

    const generateButton = await screen.findByRole("button", {
      name: "Generate AI Draft",
    });
    await user.click(generateButton);

    expect(
      await screen.findByText("AI-assisted draft · Review before sending"),
    ).toBeInTheDocument();
    expect(replyCalls).toHaveLength(0);

    await user.click(screen.getByRole("button", { name: "Send Reply" }));

    await waitFor(() => {
      expect(replyCalls).toHaveLength(1);
    });
  });

  it("renders API error messages as safe text", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(
        {
          error: {
            code: "AI_DRAFT_FAILED",
            message: "<img src=x onerror=alert(1)> Unsafe provider error",
            correlation_id: "corr_demo_001",
          },
        },
        502,
      ),
    );

    vi.stubGlobal("fetch", fetchMock);

    const { container } = render(<App />);

    const safeErrors = await screen.findAllByText(
      /Unsafe provider error Reference: corr_demo_001/,
    );

    expect(safeErrors.length).toBeGreaterThan(0);
    expect(container.querySelector("img")).toBeNull();
  });
});
