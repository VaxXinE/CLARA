export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    correlation_id: string;
    details?: Array<{
      path: string;
      message: string;
    }>;
  };
};

export type ApiPermissionHints = {
  can_view_conversation: boolean;
  can_view_customer_profile: boolean;
  can_view_activity: boolean;
  can_generate_ai_draft: boolean;
  can_send_reply: boolean;
};

export type MeResponse = {
  user: {
    id: string;
    role: "owner" | "agent" | "viewer";
  };
  organization: {
    id: string;
  };
  workspace: {
    id: string;
  };
  permissions: string[];
  auth: {
    method: "mock" | "provider";
  };
};

export type ConversationSummary = {
  id: string;
  source: string;
  provider?: string | null;
  status: string;
  snippet: string | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  customer: {
    id: string;
    display_name: string;
    source: string;
    status: string;
  };
  assigned_user: {
    id: string;
    display_name: string;
  } | null;
};

export type ConversationListResponse = {
  data: ConversationSummary[];
  pagination: {
    limit: number;
    next_cursor: string | null;
  };
  permissions: ApiPermissionHints;
};

export type ConversationDetail = {
  id: string;
  source: string;
  provider?: string | null;
  status: string;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  customer: {
    id: string;
    display_name: string;
    source: string;
    status: string;
  };
  assigned_user: {
    id: string;
    display_name: string;
  } | null;
  messages: Array<{
    id: string;
    direction: string;
    sender_type: string;
    sender_user_id: string | null;
    body: string;
    sent_at: string;
    delivery_status: string;
    created_at: string;
  }>;
};

export type ConversationDetailResponse = {
  conversation: ConversationDetail;
  permissions: ApiPermissionHints;
};

export type CustomerProfileResponse = {
  customer: {
    id: string;
    display_name: string;
    contact_identifier: string | null;
    source: string;
    status: string;
    notes_summary: string | null;
    last_interaction_at: string | null;
    created_at: string;
    updated_at: string;
  };
  permissions: ApiPermissionHints;
};

export type ActivityResponse = {
  data: {
    conversation_id: string;
    items: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      actor: {
        type: "system" | "user";
        id: string | null;
        name: string;
      };
      created_at: string;
    }>;
  };
};

export type AiDraftResponse = {
  data: {
    draft: {
      id: string;
      conversation_id: string;
      body: string;
      status: string;
      requires_human_review: true;
      created_at: string;
    };
    ai: {
      provider: string;
      model: string;
    };
  };
};

export type AiReplySuggestionResponse = {
  data: {
    suggestion: {
      suggestionId: string;
      type: "reply_suggestion";
      conversationId: string;
      customerId: string | null;
      suggestedText: string | null;
      summary: string | null;
      recommendedNextAction: string | null;
      safetyFlags: string[];
      requiresHumanApproval: true;
      blockedReason: string | null;
      safeReasonCode: string;
      contextBudgetSummary: {
        maxMessages: number;
        maxMessageChars: number;
        maxSnippetChars: number;
        includedMessages: number;
        truncatedMessages: number;
        includedSnippets: number;
        truncatedSnippets: number;
      };
      policyVersion: string;
      createdAt: string;
    };
    ai: {
      provider: "mock";
      model: string;
    };
  };
};

export type AiDraftReviewStatus =
  "suggested" | "editing" | "approved" | "rejected" | "expired" | "blocked";

export type AiDraftReview = {
  draftId: string;
  suggestionId: string | null;
  conversationId: string;
  customerId: string | null;
  workspaceId: string;
  channel: string;
  status: AiDraftReviewStatus;
  draftText: string;
  editedText: string | null;
  reviewedByUserId: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  safeReasonCode: string;
  safetyFlags: string[];
  requiresHumanApproval: true;
  policyVersion: string;
  createdAt: string;
  updatedAt: string;
};

export type AiDraftReviewResponse = {
  data: {
    review: AiDraftReview;
  };
};

export type ReplySendResponse = {
  data: {
    message?: {
      id: string;
      conversation_id: string;
      direction: "outbound";
      body: string;
      sender: {
        type: "user";
        id: string;
        name: string;
      };
      created_at: string;
    };
    send: {
      provider: string;
      status: "sent" | "simulated" | "failed";
      provider_message_id?: string;
      outbound_delivery_id?: string;
      reason_code?: string;
      sent_at?: string;
      correlation_id?: string;
    };
  };
};

export type GmailOutboundDeliveryStatus = {
  outbound_delivery_id: string;
  provider: "gmail";
  status: "sent" | "simulated" | "failed";
  reason_code?: string;
  provider_message_id?: string;
  conversation_id: string;
  sent_at?: string;
  failed_at?: string;
  created_at: string;
  correlation_id?: string;
};

export type GmailOutboundDeliveryStatusResponse = {
  data: GmailOutboundDeliveryStatus;
};

export type WebchatOutboundDeliveryStatus = {
  outbound_delivery_id: string;
  provider: "webchat";
  status: "pending" | "sent" | "simulated" | "failed" | "skipped";
  reason_code?: string;
  provider_message_id?: string;
  conversation_id: string;
  channel_account_id: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
  correlation_id?: string;
};

export type WebchatOutboundDeliveryStatusResponse = {
  data: WebchatOutboundDeliveryStatus;
};

export type GmailSchedulerStatus = {
  scheduler_enabled: boolean;
  scheduler_running: boolean;
  interval_ms: number;
  max_accounts_per_tick: number;
  max_messages_per_account: number;
  last_started_at?: string;
  last_stopped_at?: string;
  last_tick_started_at?: string;
  last_tick_finished_at?: string;
  last_tick_status?: string;
  last_reason_code?: string;
};

export type GmailSchedulerStatusResponse = {
  data: GmailSchedulerStatus;
};

export type ChannelHealthStatus =
  | "connected"
  | "disconnected"
  | "degraded"
  | "auth_required"
  | "rate_limited"
  | "error"
  | "simulated_only"
  | "unsupported";

export type ChannelHealthItem = {
  channel: string;
  provider: string;
  status: ChannelHealthStatus;
  readinessLevel: "production" | "simulated" | "planned";
  workspaceId: string;
  accountId: string | null;
  safeSummary: string;
  safeReasonCode: string;
  lastCheckedAt: string | null;
  nextRecommendedAction: string;
};

export type ChannelHealthResponse = {
  data: {
    items: ChannelHealthItem[];
  };
};

export type WorkspaceMember = {
  user_id: string;
  display_name: string;
  email: string;
  role: "owner" | "agent" | "viewer" | string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

export type WorkspaceMembersResponse = {
  data: {
    members: WorkspaceMember[];
  };
  permissions: {
    can_read_members: boolean;
    can_invite_users: false;
    can_update_roles: false;
    can_delete_users: false;
  };
};

export type RoleManagementReadiness = {
  status: "readiness_only";
  workspace_id: string;
  current_user: {
    id: string;
    role: string;
  };
  policy: {
    role: string;
    can_read_members: boolean;
    can_read_readiness: boolean;
    can_invite_users: false;
    can_update_roles: false;
    can_delete_users: false;
    mutation_status: "not_implemented";
  };
  disabled_controls: ["invite_user", "update_role", "delete_user"];
  message: string;
};

export type RoleManagementReadinessResponse = {
  data: RoleManagementReadiness;
};

export type DemoRole = "owner" | "agent" | "viewer";

export type DemoAuthProfile = {
  label: string;
  role: DemoRole;
  userId: string;
  organizationId: string;
  workspaceId: string;
};
