import type {
  ActivityResponse,
  AiDraftResponse,
  ApiErrorResponse,
  ConversationDetailResponse,
  ConversationListResponse,
  CustomerProfileResponse,
  DemoAuthProfile,
  MeResponse,
  ReplySendResponse,
} from "./types";

export class ApiClientError extends Error {
  readonly code: string;
  readonly correlationId: string;
  readonly statusCode: number;
  readonly details?: ApiErrorResponse["error"]["details"];

  constructor(input: {
    code: string;
    message: string;
    correlationId: string;
    statusCode: number;
    details?: ApiErrorResponse["error"]["details"];
  }) {
    super(input.message);
    this.name = "ApiClientError";
    this.code = input.code;
    this.correlationId = input.correlationId;
    this.statusCode = input.statusCode;
    this.details = input.details;
  }
}

export type ApiClientConfig = {
  baseUrl: string;
  demoAuthProfile?: DemoAuthProfile;
};

export type ConversationListFilters = {
  status?: string;
  search?: string;
  limit?: number;
};

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, "")}${path}`;
}

function toHeaders(profile?: DemoAuthProfile): HeadersInit {
  if (!profile) {
    return {
      "content-type": "application/json",
    };
  }

  return {
    "content-type": "application/json",
    "x-mock-user-id": profile.userId,
    "x-mock-organization-id": profile.organizationId,
    "x-mock-workspace-id": profile.workspaceId,
    "x-mock-role": profile.role,
  };
}

function toQueryString(filters: ConversationListFilters): string {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.search) {
    params.set("search", filters.search);
  }

  params.set("limit", String(filters.limit ?? 20));

  const query = params.toString();

  return query ? `?${query}` : "";
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly demoAuthProfile?: DemoAuthProfile;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.demoAuthProfile = config.demoAuthProfile;
  }

  async getMe(): Promise<MeResponse> {
    return this.request<MeResponse>("/api/v1/me");
  }

  async listConversations(
    filters: ConversationListFilters,
  ): Promise<ConversationListResponse> {
    return this.request<ConversationListResponse>(
      `/api/v1/conversations${toQueryString(filters)}`,
    );
  }

  async getConversation(
    conversationId: string,
  ): Promise<ConversationDetailResponse> {
    return this.request<ConversationDetailResponse>(
      `/api/v1/conversations/${encodeURIComponent(conversationId)}`,
    );
  }

  async getCustomer(customerId: string): Promise<CustomerProfileResponse> {
    return this.request<CustomerProfileResponse>(
      `/api/v1/customers/${encodeURIComponent(customerId)}`,
    );
  }

  async getActivity(conversationId: string): Promise<ActivityResponse> {
    return this.request<ActivityResponse>(
      `/api/v1/conversations/${encodeURIComponent(conversationId)}/activity`,
    );
  }

  async createAiDraft(
    conversationId: string,
    payload: {
      tone?: string;
      instruction?: string;
    },
  ): Promise<AiDraftResponse> {
    return this.request<AiDraftResponse>(
      `/api/v1/conversations/${encodeURIComponent(conversationId)}/ai-draft`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  }

  async sendReply(
    conversationId: string,
    payload: {
      body: string;
      draft_id?: string;
    },
  ): Promise<ReplySendResponse> {
    return this.request<ReplySendResponse>(
      `/api/v1/conversations/${encodeURIComponent(conversationId)}/reply`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(joinUrl(this.baseUrl, path), {
      ...init,
      headers: {
        ...toHeaders(this.demoAuthProfile),
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      let errorPayload: ApiErrorResponse | null = null;

      try {
        errorPayload = (await response.json()) as ApiErrorResponse;
      } catch {
        errorPayload = null;
      }

      throw new ApiClientError({
        code: errorPayload?.error.code ?? "REQUEST_FAILED",
        message: errorPayload?.error.message ?? "Request failed.",
        correlationId: errorPayload?.error.correlation_id ?? "unknown",
        statusCode: response.status,
        details: errorPayload?.error.details,
      });
    }

    return (await response.json()) as T;
  }
}
