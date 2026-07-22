import {
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import type { Database } from "../db/client";
import { conversations, customers, messages, users } from "../db/schema";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type {
  ConversationDetailRecord,
  ConversationListFilters,
  ConversationListItemRecord,
  ConversationMessageRecord,
  ConversationRepository,
  PaginatedConversationList,
} from "./conversation-repository";
import { toConversationCursor } from "./conversation-repository";

type ConversationListRow = {
  id: string;
  source: string;
  status: string;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  customerId: string | null;
  customerDisplayName: string | null;
  customerContactIdentifier: string | null;
  customerSource: string | null;
  customerStatus: string | null;
  assignedUserId: string | null;
  assignedUserDisplayName: string | null;
};

type LatestMessageRow = {
  conversationId: string;
  body: string;
};

type ConversationMessageRow = {
  id: string;
  direction: string;
  senderType: string;
  senderUserId: string | null;
  body: string;
  sentAt: Date;
  deliveryStatus: string;
  createdAt: Date;
};

function toConversationListItemRecord(
  row: ConversationListRow,
  snippets: Map<string, string | null>,
): ConversationListItemRecord {
  return {
    id: row.id,
    source: row.source,
    status: row.status,
    snippet: snippets.get(row.id) ?? null,
    lastMessageAt: row.lastMessageAt ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    customer:
      row.customerId &&
      row.customerDisplayName &&
      row.customerSource &&
      row.customerStatus
        ? {
            id: row.customerId,
            displayName: row.customerDisplayName,
            contactIdentifier: row.customerContactIdentifier,
            source: row.customerSource,
            status: row.customerStatus,
          }
        : null,
    assignedUser: row.assignedUserId
      ? {
          id: row.assignedUserId,
          displayName: row.assignedUserDisplayName ?? row.assignedUserId,
        }
      : null,
  };
}

function toConversationMessageRecord(
  row: ConversationMessageRow,
): ConversationMessageRecord {
  return {
    id: row.id,
    direction: row.direction,
    senderType: row.senderType,
    senderUserId: row.senderUserId ?? null,
    body: row.body,
    sentAt: row.sentAt,
    deliveryStatus: row.deliveryStatus,
    createdAt: row.createdAt,
  };
}

function toConversationDetailRecord(
  row: ConversationListRow,
  messageRows: ConversationMessageRow[],
): ConversationDetailRecord {
  return {
    id: row.id,
    source: row.source,
    status: row.status,
    lastMessageAt: row.lastMessageAt ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    customer:
      row.customerId &&
      row.customerDisplayName &&
      row.customerSource &&
      row.customerStatus
        ? {
            id: row.customerId,
            displayName: row.customerDisplayName,
            contactIdentifier: row.customerContactIdentifier,
            source: row.customerSource,
            status: row.customerStatus,
          }
        : null,
    assignedUser: row.assignedUserId
      ? {
          id: row.assignedUserId,
          displayName: row.assignedUserDisplayName ?? row.assignedUserId,
        }
      : null,
    messages: messageRows.map(toConversationMessageRecord),
  };
}

function buildLatestMessageMap(
  rows: LatestMessageRow[],
): Map<string, string | null> {
  const snippets = new Map<string, string | null>();

  for (const row of rows) {
    if (!snippets.has(row.conversationId)) {
      snippets.set(row.conversationId, row.body);
    }
  }

  return snippets;
}

export class DrizzleConversationRepository implements ConversationRepository {
  constructor(private readonly db: Database) {}

  async listScoped(
    scope: WorkspaceScope,
    filters: ConversationListFilters,
  ): Promise<PaginatedConversationList> {
    const sortTimestamp = sql<Date>`coalesce(${conversations.lastMessageAt}, ${conversations.createdAt})`;
    const conditions: SQL[] = [
      eq(conversations.organizationId, scope.organizationId),
      eq(conversations.workspaceId, scope.workspaceId),
    ];

    if (filters.status) {
      conditions.push(eq(conversations.status, filters.status));
    }

    if (filters.assignedTo) {
      conditions.push(eq(conversations.assignedUserId, filters.assignedTo));
    }

    if (filters.search) {
      const pattern = `%${filters.search}%`;
      conditions.push(
        or(
          ilike(customers.displayName, pattern),
          ilike(customers.contactIdentifier, pattern),
        )!,
      );
    }

    if (filters.cursor) {
      conditions.push(
        sql`(
          ${sortTimestamp} < ${new Date(filters.cursor.sortTimestamp)}
          or (
            ${sortTimestamp} = ${new Date(filters.cursor.sortTimestamp)}
            and ${conversations.id} < ${filters.cursor.conversationId}
          )
        )`,
      );
    }

    const rows = await this.db
      .select({
        id: conversations.id,
        source: conversations.source,
        status: conversations.status,
        lastMessageAt: conversations.lastMessageAt,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        customerId: customers.id,
        customerDisplayName: customers.displayName,
        customerContactIdentifier: customers.contactIdentifier,
        customerSource: customers.source,
        customerStatus: customers.status,
        assignedUserId: users.id,
        assignedUserDisplayName: users.displayName,
      })
      .from(conversations)
      .leftJoin(
        customers,
        and(
          eq(conversations.customerId, customers.id),
          eq(customers.organizationId, scope.organizationId),
          eq(customers.workspaceId, scope.workspaceId),
        ),
      )
      .leftJoin(
        users,
        and(
          eq(conversations.assignedUserId, users.id),
          eq(users.organizationId, scope.organizationId),
        ),
      )
      .where(and(...conditions))
      .orderBy(desc(sortTimestamp), desc(conversations.id))
      .limit(filters.limit + 1);

    const conversationIds = rows.map((row) => row.id);
    let latestMessageMap = new Map<string, string | null>();

    if (conversationIds.length > 0) {
      const latestMessageRows = await this.db
        .select({
          conversationId: messages.conversationId,
          body: messages.body,
        })
        .from(messages)
        .where(
          and(
            eq(messages.organizationId, scope.organizationId),
            eq(messages.workspaceId, scope.workspaceId),
            inArray(messages.conversationId, conversationIds),
          ),
        )
        .orderBy(desc(messages.sentAt), desc(messages.id));

      latestMessageMap = buildLatestMessageMap(latestMessageRows);
    }

    const items = rows.map((row) =>
      toConversationListItemRecord(row, latestMessageMap),
    );
    const hasNextPage = items.length > filters.limit;
    const pagedItems = hasNextPage ? items.slice(0, filters.limit) : items;

    return {
      items: pagedItems,
      nextCursor: hasNextPage
        ? toConversationCursor(pagedItems[pagedItems.length - 1]!)
        : null,
    };
  }

  async listByCustomerScoped(
    scope: WorkspaceScope,
    customerId: string,
  ): Promise<ConversationListItemRecord[]> {
    const sortTimestamp = sql<Date>`coalesce(${conversations.lastMessageAt}, ${conversations.createdAt})`;

    const rows = await this.db
      .select({
        id: conversations.id,
        source: conversations.source,
        status: conversations.status,
        lastMessageAt: conversations.lastMessageAt,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        customerId: customers.id,
        customerDisplayName: customers.displayName,
        customerContactIdentifier: customers.contactIdentifier,
        customerSource: customers.source,
        customerStatus: customers.status,
        assignedUserId: users.id,
        assignedUserDisplayName: users.displayName,
      })
      .from(conversations)
      .innerJoin(customers, eq(conversations.customerId, customers.id))
      .leftJoin(
        users,
        and(
          eq(conversations.assignedUserId, users.id),
          eq(users.organizationId, scope.organizationId),
        ),
      )
      .where(
        and(
          eq(conversations.organizationId, scope.organizationId),
          eq(conversations.workspaceId, scope.workspaceId),
          eq(conversations.customerId, customerId),
          eq(customers.organizationId, scope.organizationId),
          eq(customers.workspaceId, scope.workspaceId),
          eq(customers.id, customerId),
        ),
      )
      .orderBy(desc(sortTimestamp), desc(conversations.id))
      .limit(500);

    const conversationIds = rows.map((row) => row.id);
    let latestMessageMap = new Map<string, string | null>();

    if (conversationIds.length > 0) {
      const latestMessageRows = await this.db
        .select({
          conversationId: messages.conversationId,
          body: messages.body,
        })
        .from(messages)
        .where(
          and(
            eq(messages.organizationId, scope.organizationId),
            eq(messages.workspaceId, scope.workspaceId),
            inArray(messages.conversationId, conversationIds),
          ),
        )
        .orderBy(desc(messages.sentAt), desc(messages.id));

      latestMessageMap = buildLatestMessageMap(latestMessageRows);
    }

    return rows.map((row) =>
      toConversationListItemRecord(row, latestMessageMap),
    );
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<ConversationDetailRecord | null> {
    const conversationRows = await this.db
      .select({
        id: conversations.id,
        source: conversations.source,
        status: conversations.status,
        lastMessageAt: conversations.lastMessageAt,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        customerId: customers.id,
        customerDisplayName: customers.displayName,
        customerContactIdentifier: customers.contactIdentifier,
        customerSource: customers.source,
        customerStatus: customers.status,
        assignedUserId: users.id,
        assignedUserDisplayName: users.displayName,
      })
      .from(conversations)
      .leftJoin(
        customers,
        and(
          eq(conversations.customerId, customers.id),
          eq(customers.organizationId, scope.organizationId),
          eq(customers.workspaceId, scope.workspaceId),
        ),
      )
      .leftJoin(
        users,
        and(
          eq(conversations.assignedUserId, users.id),
          eq(users.organizationId, scope.organizationId),
        ),
      )
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.organizationId, scope.organizationId),
          eq(conversations.workspaceId, scope.workspaceId),
        ),
      )
      .limit(1);

    const row = conversationRows[0];

    if (!row) {
      return null;
    }

    const messageRows = await this.db
      .select({
        id: messages.id,
        direction: messages.direction,
        senderType: messages.senderType,
        senderUserId: messages.senderUserId,
        body: messages.body,
        sentAt: messages.sentAt,
        deliveryStatus: messages.deliveryStatus,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(
        and(
          eq(messages.conversationId, row.id),
          eq(messages.organizationId, scope.organizationId),
          eq(messages.workspaceId, scope.workspaceId),
        ),
      )
      .orderBy(asc(messages.sentAt), asc(messages.id));

    return toConversationDetailRecord(row, messageRows);
  }

  async linkCustomerScoped(
    scope: WorkspaceScope,
    conversationId: string,
    customerId: string,
  ): Promise<ConversationDetailRecord | null> {
    const existingCustomer = await this.db
      .select({ id: customers.id })
      .from(customers)
      .where(
        and(
          eq(customers.id, customerId),
          eq(customers.organizationId, scope.organizationId),
          eq(customers.workspaceId, scope.workspaceId),
        ),
      )
      .limit(1);

    if (!existingCustomer[0]) return null;

    const updated = await this.db
      .update(conversations)
      .set({ customerId, updatedAt: new Date() })
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.organizationId, scope.organizationId),
          eq(conversations.workspaceId, scope.workspaceId),
        ),
      )
      .returning({ id: conversations.id });

    if (!updated[0]) return null;

    return this.findByIdScoped(scope, conversationId);
  }

  async unlinkCustomerScoped(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<ConversationDetailRecord | null> {
    const updated = await this.db
      .update(conversations)
      .set({ customerId: null, updatedAt: new Date() })
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.organizationId, scope.organizationId),
          eq(conversations.workspaceId, scope.workspaceId),
        ),
      )
      .returning({ id: conversations.id });

    if (!updated[0]) return null;

    return this.findByIdScoped(scope, conversationId);
  }
}
