import { assertPermission } from "../auth/permissions";
import {
  buildPermissionHints,
  type PermissionHints,
} from "../auth/permission-hints";
import type { AuthContext } from "../auth/auth-context";
import { NotFoundError, ValidationError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import type {
  ConversationCursor,
  ConversationDetailRecord,
  ConversationListFilters,
  ConversationListItemRecord,
  ConversationMessageRecord,
  ConversationRepository,
} from "./conversation-repository";

export type ConversationListRequest = {
  auth: AuthContext;
  filters: ConversationListFilters;
};

export type ConversationSummaryDto = {
  id: string;
  source: string;
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

export type ConversationDetailDto = {
  id: string;
  source: string;
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

export type ConversationListResult = {
  data: ConversationSummaryDto[];
  pagination: {
    limit: number;
    next_cursor: string | null;
  };
  permissions: PermissionHints;
};

export type ConversationDetailResult = {
  conversation: ConversationDetailDto;
  permissions: PermissionHints;
};

function encodeCursor(cursor: ConversationCursor): string {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}

export function decodeCursor(value: string): ConversationCursor {
  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as Partial<ConversationCursor> | null;

    if (
      !parsed ||
      typeof parsed.sortTimestamp !== "string" ||
      typeof parsed.conversationId !== "string"
    ) {
      throw new Error("Invalid cursor");
    }

    const sortTimestamp = new Date(parsed.sortTimestamp);

    if (Number.isNaN(sortTimestamp.getTime())) {
      throw new Error("Invalid cursor timestamp");
    }

    return {
      sortTimestamp: sortTimestamp.toISOString(),
      conversationId: parsed.conversationId,
    };
  } catch {
    throw new ValidationError("Invalid request.", [
      {
        path: "query.cursor",
        message: "Invalid cursor.",
      },
    ]);
  }
}

function toConversationSummaryDto(
  record: ConversationListItemRecord,
): ConversationSummaryDto {
  return {
    id: record.id,
    source: record.source,
    status: record.status,
    snippet: record.snippet,
    last_message_at: record.lastMessageAt?.toISOString() ?? null,
    created_at: record.createdAt.toISOString(),
    updated_at: record.updatedAt.toISOString(),
    customer: {
      id: record.customer.id,
      display_name: record.customer.displayName,
      source: record.customer.source,
      status: record.customer.status,
    },
    assigned_user: record.assignedUser
      ? {
          id: record.assignedUser.id,
          display_name: record.assignedUser.displayName,
        }
      : null,
  };
}

function toMessageDto(record: ConversationMessageRecord) {
  return {
    id: record.id,
    direction: record.direction,
    sender_type: record.senderType,
    sender_user_id: record.senderUserId,
    body: record.body,
    sent_at: record.sentAt.toISOString(),
    delivery_status: record.deliveryStatus,
    created_at: record.createdAt.toISOString(),
  };
}

function toConversationDetailDto(
  record: ConversationDetailRecord,
): ConversationDetailDto {
  return {
    id: record.id,
    source: record.source,
    status: record.status,
    last_message_at: record.lastMessageAt?.toISOString() ?? null,
    created_at: record.createdAt.toISOString(),
    updated_at: record.updatedAt.toISOString(),
    customer: {
      id: record.customer.id,
      display_name: record.customer.displayName,
      source: record.customer.source,
      status: record.customer.status,
    },
    assigned_user: record.assignedUser
      ? {
          id: record.assignedUser.id,
          display_name: record.assignedUser.displayName,
        }
      : null,
    messages: record.messages.map(toMessageDto),
  };
}

export class ConversationQueryService {
  constructor(private readonly repository: ConversationRepository) {}

  async listConversations(
    input: ConversationListRequest,
  ): Promise<ConversationListResult> {
    assertPermission(input.auth.role, "conversation:read");

    const result = await this.repository.listScoped(
      getWorkspaceScopeFromAuth(input.auth),
      input.filters,
    );

    return {
      data: result.items.map(toConversationSummaryDto),
      pagination: {
        limit: input.filters.limit,
        next_cursor: result.nextCursor ? encodeCursor(result.nextCursor) : null,
      },
      permissions: buildPermissionHints(input.auth.role),
    };
  }

  async getConversationDetail(input: {
    auth: AuthContext;
    conversationId: string;
  }): Promise<ConversationDetailResult> {
    assertPermission(input.auth.role, "conversation:read");

    const record = await this.repository.findByIdScoped(
      getWorkspaceScopeFromAuth(input.auth),
      input.conversationId,
    );

    if (!record) {
      throw new NotFoundError("Conversation not found.");
    }

    return {
      conversation: toConversationDetailDto(record),
      permissions: buildPermissionHints(input.auth.role),
    };
  }
}
