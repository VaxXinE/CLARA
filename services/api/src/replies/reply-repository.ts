import { randomUUID } from "node:crypto";
import type { InferInsertModel } from "drizzle-orm";
import { demoUsers } from "../db/fixtures/demo-data";
import type { FixtureAppStore } from "../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../db/fixtures/fixture-store";
import { activityEvents, messages } from "../db/schema";
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

export function createPrefixedId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

function findUserDisplayName(userId: string): string {
  return demoUsers.find((user) => user.id === userId)?.displayName ?? userId;
}

export function buildMessageRow(
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

export function buildActivityEventRow(
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

export function toCreatedReplyRecord(input: {
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
