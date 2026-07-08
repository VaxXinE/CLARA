import { and, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import {
  activityEvents,
  conversations,
  messages,
  replyDrafts,
  users,
} from "../db/schema";
import { NotFoundError } from "../errors/app-error";
import type { CreatedReplyRecord } from "./reply-dto";
import type { CreateReplyInput, ReplyRepository } from "./reply-repository";
import {
  buildActivityEventRow,
  buildMessageRow,
  createPrefixedId,
  toCreatedReplyRecord,
} from "./reply-repository";

async function assertScopedConversationExists(
  tx: Database,
  input: CreateReplyInput,
): Promise<void> {
  const rows = await tx
    .select({
      id: conversations.id,
    })
    .from(conversations)
    .where(
      and(
        eq(conversations.id, input.conversationId),
        eq(conversations.organizationId, input.scope.organizationId),
        eq(conversations.workspaceId, input.scope.workspaceId),
      ),
    )
    .limit(1);

  if (!rows[0]) {
    throw new NotFoundError("Conversation not found.");
  }
}

async function assertScopedDraftAndMarkSent(
  tx: Database,
  input: CreateReplyInput,
  updatedAt: Date,
): Promise<void> {
  if (!input.draftId) {
    return;
  }

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

  if (!draftRows[0]) {
    throw new NotFoundError("Reply draft not found.");
  }

  await tx
    .update(replyDrafts)
    .set({
      status: "sent",
      updatedAt,
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

export class DrizzleReplyRepository implements ReplyRepository {
  constructor(private readonly db: Database) {}

  async createReply(input: CreateReplyInput): Promise<CreatedReplyRecord> {
    return this.db.transaction(async (tx) => {
      const createdAt = new Date();
      const messageId = createPrefixedId("msg");
      const activityEventId = createPrefixedId("act");

      await assertScopedConversationExists(tx as Database, input);
      await assertScopedDraftAndMarkSent(tx as Database, input, createdAt);

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
