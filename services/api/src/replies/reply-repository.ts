import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";
import type { Database } from "../db/client";
import { demoUsers } from "../db/fixtures/demo-data";
import type { FixtureAppStore } from "../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../db/fixtures/fixture-store";
import {
  activityEvents,
  conversations,
  messages,
  replyDrafts,
  users,
} from "../db/schema";
import { NotFoundError } from "../errors/app-error";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type { CreatedReplyRecord } from "./reply-dto";

type MessageInsert = InferInsertModel<typeof messages>;
type ActivityEventInsert = InferInsertModel<typeof activityEvents>;

export type CreateReplyInput = {
  scope: WorkspaceScope;
  conversationId: string;
  senderUserId: string;
  body: string;
  provider: string;
  sendStatus: "sent";
  deliveryStatus: "sent" | "simulated";
  draftId?: string;
};

export interface ReplyRepository {
  createReply(input: CreateReplyInput): Promise<CreatedReplyRecord>;
}

function createPrefixedId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

function findUserDisplayName(userId: string): string {
  return demoUsers.find((user) => user.id === userId)?.displayName ?? userId;
}

function buildMessageRow(
  input: CreateReplyInput,
  messageId: string,
  createdAt: Date,
): MessageInsert {
  return {
    id: messageId,
    organizationId: input.scope.organizationId,
    workspaceId: input.scope.workspaceId,
    conversationId: input.conversationId,
    direction: "outbound",
    senderType: "agent",
    senderUserId: input.senderUserId,
    body: input.body,
    sentAt: createdAt,
    deliveryStatus: input.deliveryStatus,
    createdAt,
  };
}

function buildActivityEventRow(
  input: CreateReplyInput,
  activityEventId: string,
  messageId: string,
  createdAt: Date,
): ActivityEventInsert {
  return {
    id: activityEventId,
    organizationId: input.scope.organizationId,
    workspaceId: input.scope.workspaceId,
    conversationId: input.conversationId,
    actorUserId: input.senderUserId,
    eventType: "reply_sent",
    summary: "Reply sent for conversation.",
    metadata: {
      message_id: messageId,
      send_mode: input.provider,
      delivery_status: input.deliveryStatus,
    },
    createdAt,
  };
}

function toCreatedReplyRecord(input: {
  messageId: string;
  conversationId: string;
  body: string;
  senderUserId: string;
  senderName: string;
  createdAt: Date;
  provider: string;
}): CreatedReplyRecord {
  return {
    id: input.messageId,
    conversationId: input.conversationId,
    body: input.body,
    senderUserId: input.senderUserId,
    senderName: input.senderName,
    createdAt: input.createdAt,
    provider: input.provider,
    status: "sent",
  };
}

function assertScopedDraft(
  store: FixtureAppStore,
  input: CreateReplyInput,
): void {
  if (!input.draftId) {
    return;
  }

  const draft = store.replyDrafts.find(
    (item) =>
      item.id === input.draftId &&
      item.organizationId === input.scope.organizationId &&
      item.workspaceId === input.scope.workspaceId &&
      item.conversationId === input.conversationId,
  );

  if (!draft) {
    throw new NotFoundError("Reply draft not found.");
  }

  draft.status = "sent";
  draft.updatedAt = new Date();
}

export class FixtureReplyRepository implements ReplyRepository {
  private readonly store: FixtureAppStore;

  constructor(store: FixtureAppStore = createFixtureAppStore()) {
    this.store = store;
  }

  async createReply(input: CreateReplyInput): Promise<CreatedReplyRecord> {
    const createdAt = new Date();
    const messageId = createPrefixedId("msg");
    const activityEventId = createPrefixedId("act");

    const conversation = this.store.conversations.find(
      (item) =>
        item.id === input.conversationId &&
        item.organizationId === input.scope.organizationId &&
        item.workspaceId === input.scope.workspaceId,
    );

    if (!conversation) {
      throw new NotFoundError("Conversation not found.");
    }

    assertScopedDraft(this.store, input);

    this.store.messages.push(buildMessageRow(input, messageId, createdAt));
    this.store.activityEvents.push(
      buildActivityEventRow(input, activityEventId, messageId, createdAt),
    );
    conversation.lastMessageAt = createdAt;
    conversation.updatedAt = createdAt;

    return toCreatedReplyRecord({
      messageId,
      conversationId: input.conversationId,
      body: input.body,
      senderUserId: input.senderUserId,
      senderName: findUserDisplayName(input.senderUserId),
      createdAt,
      provider: input.provider,
    });
  }

  getState(): FixtureAppStore {
    return structuredClone(this.store);
  }
}

export class DrizzleReplyRepository implements ReplyRepository {
  constructor(private readonly db: Database) {}

  async createReply(input: CreateReplyInput): Promise<CreatedReplyRecord> {
    return this.db.transaction(async (tx) => {
      const createdAt = new Date();
      const messageId = createPrefixedId("msg");
      const activityEventId = createPrefixedId("act");

      if (input.draftId) {
        const draftRows = await tx
          .select({
            id: replyDrafts.id,
          })
          .from(replyDrafts)
          .where(
            and(
              eq(replyDrafts.id, input.draftId),
              eq(replyDrafts.organizationId, input.scope.organizationId),
              eq(replyDrafts.workspaceId, input.scope.workspaceId),
              eq(replyDrafts.conversationId, input.conversationId),
            ),
          )
          .limit(1);

        const draft = draftRows[0];

        if (!draft) {
          throw new NotFoundError("Reply draft not found.");
        }

        await tx
          .update(replyDrafts)
          .set({
            status: "sent",
            updatedAt: createdAt,
          })
          .where(
            and(
              eq(replyDrafts.id, input.draftId),
              eq(replyDrafts.organizationId, input.scope.organizationId),
              eq(replyDrafts.workspaceId, input.scope.workspaceId),
              eq(replyDrafts.conversationId, input.conversationId),
            ),
          );
      }

      const senderRows = await tx
        .select({
          displayName: users.displayName,
        })
        .from(users)
        .where(
          and(
            eq(users.id, input.senderUserId),
            eq(users.organizationId, input.scope.organizationId),
          ),
        )
        .limit(1);

      const senderName = senderRows[0]?.displayName ?? input.senderUserId;

      await tx
        .insert(messages)
        .values(buildMessageRow(input, messageId, createdAt));
      await tx
        .insert(activityEvents)
        .values(
          buildActivityEventRow(input, activityEventId, messageId, createdAt),
        );
      await tx
        .update(conversations)
        .set({
          lastMessageAt: createdAt,
          updatedAt: createdAt,
        })
        .where(
          and(
            eq(conversations.id, input.conversationId),
            eq(conversations.organizationId, input.scope.organizationId),
            eq(conversations.workspaceId, input.scope.workspaceId),
          ),
        );

      return toCreatedReplyRecord({
        messageId,
        conversationId: input.conversationId,
        body: input.body,
        senderUserId: input.senderUserId,
        senderName,
        createdAt,
        provider: input.provider,
      });
    });
  }
}
