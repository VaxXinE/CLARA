import {
  and,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
  asc,
  type SQL,
} from "drizzle-orm";
import type { Database } from "../db/client";
import {
  demoConversations,
  demoCustomers,
  demoMessages,
  demoUsers,
} from "../db/fixtures/demo-data";
import { conversations, customers, messages, users } from "../db/schema";
import type { WorkspaceScope } from "../workspace/workspace-scope";

export type ConversationListFilters = {
  status?: string;
  assignedTo?: string;
  search?: string;
  limit: number;
  cursor?: ConversationCursor;
};

export type ConversationCursor = {
  sortTimestamp: string;
  conversationId: string;
};

export type ConversationCustomerSummaryRecord = {
  id: string;
  displayName: string;
  source: string;
  status: string;
};

export type AssignedUserSummaryRecord = {
  id: string;
  displayName: string;
} | null;

export type ConversationListItemRecord = {
  id: string;
  source: string;
  status: string;
  snippet: string | null;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  customer: ConversationCustomerSummaryRecord;
  assignedUser: AssignedUserSummaryRecord;
};

export type ConversationMessageRecord = {
  id: string;
  direction: string;
  senderType: string;
  senderUserId: string | null;
  body: string;
  sentAt: Date;
  deliveryStatus: string;
  createdAt: Date;
};

export type ConversationDetailRecord = {
  id: string;
  source: string;
  status: string;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  customer: ConversationCustomerSummaryRecord;
  assignedUser: AssignedUserSummaryRecord;
  messages: ConversationMessageRecord[];
};

export type PaginatedConversationList = {
  items: ConversationListItemRecord[];
  nextCursor: ConversationCursor | null;
};

export interface ConversationRepository {
  listScoped(
    scope: WorkspaceScope,
    filters: ConversationListFilters,
  ): Promise<PaginatedConversationList>;
  findByIdScoped(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<ConversationDetailRecord | null>;
}

function requireDate(value: Date | undefined, field: string): Date {
  if (!value) {
    throw new Error(`Fixture is missing required date field: ${field}`);
  }

  return value;
}

function getSortTimestamp(input: {
  lastMessageAt: Date | null;
  createdAt: Date;
}): Date {
  return input.lastMessageAt ?? input.createdAt;
}

function toConversationCursor(record: {
  id: string;
  lastMessageAt: Date | null;
  createdAt: Date;
}): ConversationCursor {
  return {
    sortTimestamp: getSortTimestamp(record).toISOString(),
    conversationId: record.id,
  };
}

function compareCursor(
  item: {
    id: string;
    lastMessageAt: Date | null;
    createdAt: Date;
  },
  cursor: ConversationCursor,
): boolean {
  const itemTimestamp = getSortTimestamp(item).toISOString();

  if (itemTimestamp < cursor.sortTimestamp) {
    return true;
  }

  return (
    itemTimestamp === cursor.sortTimestamp && item.id < cursor.conversationId
  );
}

function sortConversationItems<
  T extends {
    id: string;
    lastMessageAt: Date | null;
    createdAt: Date;
  },
>(items: T[]): T[] {
  return [...items].sort((left, right) => {
    const leftTimestamp = getSortTimestamp(left).getTime();
    const rightTimestamp = getSortTimestamp(right).getTime();

    if (leftTimestamp !== rightTimestamp) {
      return rightTimestamp - leftTimestamp;
    }

    return right.id.localeCompare(left.id);
  });
}

function buildMessageSnippet(
  conversationId: string,
  scope: WorkspaceScope,
): string | null {
  const latestMessage = [...demoMessages]
    .filter(
      (message) =>
        message.organizationId === scope.organizationId &&
        message.workspaceId === scope.workspaceId &&
        message.conversationId === conversationId,
    )
    .sort((left, right) => {
      const sentDelta = right.sentAt.getTime() - left.sentAt.getTime();

      if (sentDelta !== 0) {
        return sentDelta;
      }

      return right.id.localeCompare(left.id);
    })[0];

  return latestMessage?.body ?? null;
}

export class FixtureConversationRepository implements ConversationRepository {
  async listScoped(
    scope: WorkspaceScope,
    filters: ConversationListFilters,
  ): Promise<PaginatedConversationList> {
    const assignedUsersById = new Map(
      demoUsers.map((user) => [user.id, user.displayName]),
    );
    const customersById = new Map(
      demoCustomers.map((customer) => [customer.id, customer]),
    );

    let items = demoConversations
      .filter(
        (conversation) =>
          conversation.organizationId === scope.organizationId &&
          conversation.workspaceId === scope.workspaceId,
      )
      .filter((conversation) =>
        filters.status ? conversation.status === filters.status : true,
      )
      .filter((conversation) =>
        filters.assignedTo
          ? conversation.assignedUserId === filters.assignedTo
          : true,
      )
      .filter((conversation) => {
        if (!filters.search) {
          return true;
        }

        const searchValue = filters.search.toLowerCase();
        const customer = customersById.get(conversation.customerId);

        return Boolean(
          customer &&
          (customer.displayName.toLowerCase().includes(searchValue) ||
            (customer.contactIdentifier ?? "")
              .toLowerCase()
              .includes(searchValue)),
        );
      })
      .map((conversation) => {
        const customer = customersById.get(conversation.customerId);

        if (!customer) {
          return null;
        }

        return {
          id: conversation.id,
          source: conversation.source,
          status: conversation.status,
          snippet: buildMessageSnippet(conversation.id, scope),
          lastMessageAt: conversation.lastMessageAt ?? null,
          createdAt: requireDate(
            conversation.createdAt,
            "conversation.createdAt",
          ),
          updatedAt: requireDate(
            conversation.updatedAt,
            "conversation.updatedAt",
          ),
          customer: {
            id: customer.id,
            displayName: customer.displayName,
            source: customer.source,
            status: customer.status,
          },
          assignedUser: conversation.assignedUserId
            ? {
                id: conversation.assignedUserId,
                displayName:
                  assignedUsersById.get(conversation.assignedUserId) ??
                  conversation.assignedUserId,
              }
            : null,
        };
      })
      .filter((item): item is ConversationListItemRecord => item !== null);

    items = sortConversationItems(items).filter((item) =>
      filters.cursor ? compareCursor(item, filters.cursor) : true,
    );

    const page = items.slice(0, filters.limit + 1);
    const hasNextPage = page.length > filters.limit;
    const pagedItems = hasNextPage ? page.slice(0, filters.limit) : page;

    return {
      items: pagedItems,
      nextCursor: hasNextPage
        ? toConversationCursor(pagedItems[pagedItems.length - 1]!)
        : null,
    };
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<ConversationDetailRecord | null> {
    const conversation =
      demoConversations.find(
        (item) =>
          item.id === conversationId &&
          item.organizationId === scope.organizationId &&
          item.workspaceId === scope.workspaceId,
      ) ?? null;

    if (!conversation) {
      return null;
    }

    const customer = demoCustomers.find(
      (item) =>
        item.id === conversation.customerId &&
        item.organizationId === scope.organizationId &&
        item.workspaceId === scope.workspaceId,
    );

    if (!customer) {
      return null;
    }

    const assignedUser = conversation.assignedUserId
      ? (demoUsers.find((user) => user.id === conversation.assignedUserId) ??
        null)
      : null;

    const scopedMessages = demoMessages
      .filter(
        (message) =>
          message.organizationId === scope.organizationId &&
          message.workspaceId === scope.workspaceId &&
          message.conversationId === conversation.id,
      )
      .sort((left, right) => {
        const sentDelta = left.sentAt.getTime() - right.sentAt.getTime();

        if (sentDelta !== 0) {
          return sentDelta;
        }

        return left.id.localeCompare(right.id);
      })
      .map<ConversationMessageRecord>((message) => ({
        id: message.id,
        direction: message.direction,
        senderType: message.senderType,
        senderUserId: message.senderUserId ?? null,
        body: message.body,
        sentAt: message.sentAt,
        deliveryStatus: message.deliveryStatus,
        createdAt: requireDate(message.createdAt, "message.createdAt"),
      }));

    return {
      id: conversation.id,
      source: conversation.source,
      status: conversation.status,
      lastMessageAt: conversation.lastMessageAt ?? null,
      createdAt: requireDate(conversation.createdAt, "conversation.createdAt"),
      updatedAt: requireDate(conversation.updatedAt, "conversation.updatedAt"),
      customer: {
        id: customer.id,
        displayName: customer.displayName,
        source: customer.source,
        status: customer.status,
      },
      assignedUser: assignedUser
        ? {
            id: assignedUser.id,
            displayName: assignedUser.displayName,
          }
        : null,
      messages: scopedMessages,
    };
  }
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
      eq(customers.organizationId, scope.organizationId),
      eq(customers.workspaceId, scope.workspaceId),
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
        customerSource: customers.source,
        customerStatus: customers.status,
        assignedUserId: users.id,
        assignedUserDisplayName: users.displayName,
      })
      .from(conversations)
      .innerJoin(customers, eq(conversations.customerId, customers.id))
      .leftJoin(users, eq(conversations.assignedUserId, users.id))
      .where(and(...conditions))
      .orderBy(desc(sortTimestamp), desc(conversations.id))
      .limit(filters.limit + 1);

    const conversationIds = rows.map((row) => row.id);
    const latestMessagesByConversation = new Map<string, string | null>();

    if (conversationIds.length > 0) {
      const latestMessageRows = await this.db
        .select({
          conversationId: messages.conversationId,
          body: messages.body,
          sentAt: messages.sentAt,
          id: messages.id,
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

      for (const row of latestMessageRows) {
        if (!latestMessagesByConversation.has(row.conversationId)) {
          latestMessagesByConversation.set(row.conversationId, row.body);
        }
      }
    }

    const items = rows.map<ConversationListItemRecord>((row) => ({
      id: row.id,
      source: row.source,
      status: row.status,
      snippet: latestMessagesByConversation.get(row.id) ?? null,
      lastMessageAt: row.lastMessageAt ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      customer: {
        id: row.customerId,
        displayName: row.customerDisplayName,
        source: row.customerSource,
        status: row.customerStatus,
      },
      assignedUser: row.assignedUserId
        ? {
            id: row.assignedUserId,
            displayName: row.assignedUserDisplayName ?? row.assignedUserId,
          }
        : null,
    }));

    const hasNextPage = items.length > filters.limit;
    const pagedItems = hasNextPage ? items.slice(0, filters.limit) : items;

    return {
      items: pagedItems,
      nextCursor: hasNextPage
        ? toConversationCursor(pagedItems[pagedItems.length - 1]!)
        : null,
    };
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<ConversationDetailRecord | null> {
    const conversationRow = await this.db
      .select({
        id: conversations.id,
        source: conversations.source,
        status: conversations.status,
        lastMessageAt: conversations.lastMessageAt,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        customerId: customers.id,
        customerDisplayName: customers.displayName,
        customerSource: customers.source,
        customerStatus: customers.status,
        assignedUserId: users.id,
        assignedUserDisplayName: users.displayName,
      })
      .from(conversations)
      .innerJoin(customers, eq(conversations.customerId, customers.id))
      .leftJoin(users, eq(conversations.assignedUserId, users.id))
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.organizationId, scope.organizationId),
          eq(conversations.workspaceId, scope.workspaceId),
          eq(customers.organizationId, scope.organizationId),
          eq(customers.workspaceId, scope.workspaceId),
        ),
      )
      .limit(1);

    const row = conversationRow[0];

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

    return {
      id: row.id,
      source: row.source,
      status: row.status,
      lastMessageAt: row.lastMessageAt ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      customer: {
        id: row.customerId,
        displayName: row.customerDisplayName,
        source: row.customerSource,
        status: row.customerStatus,
      },
      assignedUser: row.assignedUserId
        ? {
            id: row.assignedUserId,
            displayName: row.assignedUserDisplayName ?? row.assignedUserId,
          }
        : null,
      messages: messageRows.map((message) => ({
        id: message.id,
        direction: message.direction,
        senderType: message.senderType,
        senderUserId: message.senderUserId ?? null,
        body: message.body,
        sentAt: message.sentAt,
        deliveryStatus: message.deliveryStatus,
        createdAt: message.createdAt,
      })),
    };
  }
}
