import type {
  ActivityResponse,
  AiDraftResponse,
  AiDraftReviewResponse,
  AiConversationSummaryResponse,
  AiCustomerNoteSuggestionResponse,
  AiFollowUpRecommendationResponse,
  AiReplySuggestionResponse,
  ApiErrorResponse,
  ChannelHealthResponse,
  ConversationDetailResponse,
  ConversationListResponse,
  CustomerProfileResponse,
  DemoAuthProfile,
  GmailOutboundDeliveryStatusResponse,
  GmailSchedulerStatusResponse,
  MeResponse,
  ReplySendResponse,
  RoleManagementReadinessResponse,
  WebchatOutboundDeliveryStatusResponse,
  WorkspaceMembersResponse,
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
  getAccessToken?: (() => Promise<string | null>) | (() => string | null);
};

export type ConversationListFilters = {
  status?: string;
  search?: string;
  limit?: number;
};

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, "")}${path}`;
}

async function toHeaders(input: {
  profile?: DemoAuthProfile;
  getAccessToken?: ApiClientConfig["getAccessToken"];
}): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };

  if (input.profile) {
    headers["x-mock-user-id"] = input.profile.userId;
    headers["x-mock-organization-id"] = input.profile.organizationId;
    headers["x-mock-workspace-id"] = input.profile.workspaceId;
    headers["x-mock-role"] = input.profile.role;
  }

  const accessToken = input.getAccessToken
    ? await input.getAccessToken()
    : null;

  if (accessToken && accessToken.trim().length > 0) {
    headers.authorization = `Bearer ${accessToken}`;
  }

  return headers;
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
  private readonly getAccessToken?: ApiClientConfig["getAccessToken"];

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.demoAuthProfile = config.demoAuthProfile;
    this.getAccessToken = config.getAccessToken;
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

  async getGmailSchedulerStatus(): Promise<GmailSchedulerStatusResponse> {
    return this.request<GmailSchedulerStatusResponse>(
      "/api/v1/integrations/gmail/scheduler/status",
    );
  }

  async getChannelHealth(): Promise<ChannelHealthResponse> {
    return this.request<ChannelHealthResponse>("/api/v1/channels/health");
  }

  async getRoleManagementReadiness(): Promise<RoleManagementReadinessResponse> {
    return this.request<RoleManagementReadinessResponse>(
      "/api/v1/workspace/roles/readiness",
    );
  }

  async listWorkspaceMembers(): Promise<WorkspaceMembersResponse> {
    return this.request<WorkspaceMembersResponse>("/api/v1/workspace/members");
  }

  async getGmailOutboundDeliveryStatus(
    deliveryId: string,
  ): Promise<GmailOutboundDeliveryStatusResponse> {
    return this.request<GmailOutboundDeliveryStatusResponse>(
      `/api/v1/integrations/gmail/outbound/deliveries/${encodeURIComponent(
        deliveryId,
      )}`,
    );
  }

  async getWebchatOutboundDeliveryStatus(
    deliveryId: string,
  ): Promise<WebchatOutboundDeliveryStatusResponse> {
    return this.request<WebchatOutboundDeliveryStatusResponse>(
      `/api/v1/integrations/webchat/outbound/deliveries/${encodeURIComponent(
        deliveryId,
      )}`,
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

  async createAiReplySuggestion(payload: {
    conversationId: string;
    customerId?: string;
    tone?: "professional" | "friendly" | "concise" | "empathetic";
    maxLength?: number;
    operatorInstruction?: string;
  }): Promise<AiReplySuggestionResponse> {
    return this.request<AiReplySuggestionResponse>(
      "/api/v1/ai/reply-suggestions",
      {
        method: "POST",
        body: JSON.stringify({
          conversationId: payload.conversationId,
          customerId: payload.customerId,
          taskType: "reply_suggestion",
          tone: payload.tone,
          maxLength: payload.maxLength,
          operatorInstruction: payload.operatorInstruction,
        }),
      },
    );
  }

  async createAiFollowUpRecommendation(payload: {
    conversationId: string;
    customerId?: string;
    urgency?: "low" | "normal" | "high";
    maxRecommendations?: number;
    operatorInstruction?: string;
  }): Promise<AiFollowUpRecommendationResponse> {
    return this.request<AiFollowUpRecommendationResponse>(
      "/api/v1/ai/follow-up-recommendations",
      {
        method: "POST",
        body: JSON.stringify({
          conversationId: payload.conversationId,
          customerId: payload.customerId,
          taskType: "follow_up_suggestion",
          urgency: payload.urgency,
          maxRecommendations: payload.maxRecommendations,
          operatorInstruction: payload.operatorInstruction,
        }),
      },
    );
  }

  async createAiConversationSummary(payload: {
    conversationId: string;
    customerId?: string;
    summaryStyle?: "brief" | "detailed" | "bullet_points";
    maxLength?: number;
    operatorInstruction?: string;
  }): Promise<AiConversationSummaryResponse> {
    return this.request<AiConversationSummaryResponse>(
      "/api/v1/ai/conversation-summaries",
      {
        method: "POST",
        body: JSON.stringify({
          conversationId: payload.conversationId,
          customerId: payload.customerId,
          taskType: "conversation_summary",
          summaryStyle: payload.summaryStyle,
          maxLength: payload.maxLength,
          operatorInstruction: payload.operatorInstruction,
        }),
      },
    );
  }

  async createAiCustomerNoteSuggestion(payload: {
    conversationId: string;
    customerId: string;
    noteStyle?: "short_note" | "sales_context" | "support_context";
    maxLength?: number;
    operatorInstruction?: string;
  }): Promise<AiCustomerNoteSuggestionResponse> {
    return this.request<AiCustomerNoteSuggestionResponse>(
      "/api/v1/ai/customer-note-suggestions",
      {
        method: "POST",
        body: JSON.stringify({
          conversationId: payload.conversationId,
          customerId: payload.customerId,
          taskType: "customer_note_summary",
          noteStyle: payload.noteStyle,
          maxLength: payload.maxLength,
          operatorInstruction: payload.operatorInstruction,
        }),
      },
    );
  }

  async createAiDraftReview(payload: {
    conversationId: string;
    customerId?: string;
    suggestionId?: string;
    draftText: string;
    safetyFlags?: string[];
  }): Promise<AiDraftReviewResponse> {
    return this.request<AiDraftReviewResponse>("/api/v1/ai/draft-reviews", {
      method: "POST",
      body: JSON.stringify({
        conversationId: payload.conversationId,
        customerId: payload.customerId,
        suggestionId: payload.suggestionId,
        draftText: payload.draftText,
        safetyFlags: payload.safetyFlags,
      }),
    });
  }

  async getAiDraftReview(draftId: string): Promise<AiDraftReviewResponse> {
    return this.request<AiDraftReviewResponse>(
      `/api/v1/ai/draft-reviews/${encodeURIComponent(draftId)}`,
    );
  }

  async editAiDraftReview(
    draftId: string,
    payload: {
      draftText: string;
    },
  ): Promise<AiDraftReviewResponse> {
    return this.request<AiDraftReviewResponse>(
      `/api/v1/ai/draft-reviews/${encodeURIComponent(draftId)}/edit`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  }

  async approveAiDraftReview(draftId: string): Promise<AiDraftReviewResponse> {
    return this.request<AiDraftReviewResponse>(
      `/api/v1/ai/draft-reviews/${encodeURIComponent(draftId)}/approve`,
      {
        method: "POST",
        body: JSON.stringify({}),
      },
    );
  }

  async rejectAiDraftReview(draftId: string): Promise<AiDraftReviewResponse> {
    return this.request<AiDraftReviewResponse>(
      `/api/v1/ai/draft-reviews/${encodeURIComponent(draftId)}/reject`,
      {
        method: "POST",
        body: JSON.stringify({}),
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
    const authHeaders = await toHeaders({
      profile: this.demoAuthProfile,
      getAccessToken: this.getAccessToken,
    });

    const response = await fetch(joinUrl(this.baseUrl, path), {
      ...init,
      headers: {
        ...authHeaders,
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
