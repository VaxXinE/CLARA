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

export type ReplySendResponse = {
  data: {
    message: {
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
      status: "sent";
    };
  };
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

export type DemoRole = "owner" | "agent" | "viewer";

export type DemoAuthProfile = {
  label: string;
  role: DemoRole;
  userId: string;
  organizationId: string;
  workspaceId: string;
};
