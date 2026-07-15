import { demoUsers } from "../db/fixtures/demo-data";
import type { FixtureAppStore } from "../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../db/fixtures/fixture-store";
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
  contactIdentifier: string | null;
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

export function toConversationCursor(record: {
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
  store: FixtureAppStore,
): string | null {
  const latestMessage = [...store.messages]
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
  private readonly store: FixtureAppStore;

  constructor(store: FixtureAppStore = createFixtureAppStore()) {
    this.store = store;
  }

  async listScoped(
    scope: WorkspaceScope,
    filters: ConversationListFilters,
  ): Promise<PaginatedConversationList> {
    const assignedUsersById = new Map(
      demoUsers.map((user) => [user.id, user.displayName]),
    );
    const customersById = new Map(
      this.store.customers.map((customer) => [customer.id, customer]),
    );

    let items = this.store.conversations
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
          snippet: buildMessageSnippet(conversation.id, scope, this.store),
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
            contactIdentifier: customer.contactIdentifier ?? null,
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

  async listByCustomerScoped(
    scope: WorkspaceScope,
    customerId: string,
  ): Promise<ConversationListItemRecord[]> {
    const result = await this.listScoped(scope, {
      limit: 500,
    });

    return result.items.filter((item) => item.customer.id === customerId);
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<ConversationDetailRecord | null> {
    const conversation =
      this.store.conversations.find(
        (item) =>
          item.id === conversationId &&
          item.organizationId === scope.organizationId &&
          item.workspaceId === scope.workspaceId,
      ) ?? null;

    if (!conversation) {
      return null;
    }

    const scopedCustomer = this.store.customers.find(
      (item) =>
        item.id === conversation.customerId &&
        item.organizationId === scope.organizationId &&
        item.workspaceId === scope.workspaceId,
    );

    if (!scopedCustomer) {
      return null;
    }

    const assignedUser = conversation.assignedUserId
      ? (demoUsers.find((user) => user.id === conversation.assignedUserId) ??
        null)
      : null;

    const scopedMessages = this.store.messages
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
        id: scopedCustomer.id,
        displayName: scopedCustomer.displayName,
        contactIdentifier: scopedCustomer.contactIdentifier ?? null,
        source: scopedCustomer.source,
        status: scopedCustomer.status,
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
