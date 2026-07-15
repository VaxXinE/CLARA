import { and, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import {
  conversations,
  activityEvents,
  aiDraftEvents,
  replyDrafts,
} from "../db/schema";
import { NotFoundError } from "../errors/app-error";
import type { CreatedAiDraftRecord } from "./ai-draft-dto";
import type {
  AiDraftReviewRecord,
  AiDraftRepository,
  CreateAiDraftArtifactsInput,
  UpdateAiDraftReviewInput,
} from "./ai-draft-repository";
import {
  buildActivityEventRow,
  buildAiDraftEventRow,
  buildReplyDraftRow,
  createPrefixedId,
  toCreatedAiDraftRecord,
} from "./ai-draft-repository";

async function assertScopedConversationExists(
  tx: Database,
  input: CreateAiDraftArtifactsInput,
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

export class DrizzleAiDraftRepository implements AiDraftRepository {
  constructor(private readonly db: Database) {}

  async createDraftArtifacts(
    input: CreateAiDraftArtifactsInput,
  ): Promise<CreatedAiDraftRecord> {
    return this.db.transaction(async (tx) => {
      const createdAt = new Date();
      const draftId = createPrefixedId("draft");
      const aiDraftEventId = createPrefixedId("ai_evt");
      const activityEventId = createPrefixedId("act");

      await assertScopedConversationExists(tx as Database, input);

      await tx
        .insert(replyDrafts)
        .values(buildReplyDraftRow(input, draftId, createdAt));
      await tx
        .insert(aiDraftEvents)
        .values(
          buildAiDraftEventRow(input, aiDraftEventId, draftId, createdAt),
        );
      await tx
        .insert(activityEvents)
        .values(
          buildActivityEventRow(input, activityEventId, draftId, createdAt),
        );

      return toCreatedAiDraftRecord({
        draftId,
        conversationId: input.conversationId,
        draftBody: input.draftBody,
        createdAt,
        provider: input.provider,
        model: input.model,
      });
    });
  }

  async findDraftByIdScoped(
    scope: CreateAiDraftArtifactsInput["scope"],
    draftId: string,
  ): Promise<AiDraftReviewRecord | null> {
    const rows = await this.db
      .select()
      .from(replyDrafts)
      .where(
        and(
          eq(replyDrafts.id, draftId),
          eq(replyDrafts.organizationId, scope.organizationId),
          eq(replyDrafts.workspaceId, scope.workspaceId),
        ),
      )
      .limit(1);

    return rows[0] ?? null;
  }

  async updateDraftReview(
    input: UpdateAiDraftReviewInput,
  ): Promise<AiDraftReviewRecord | null> {
    const updates: Partial<typeof replyDrafts.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (input.draftBody !== undefined) {
      updates.draftBody = input.draftBody;
    }

    if (input.status !== undefined) {
      updates.status = input.status;
    }

    const rows = await this.db
      .update(replyDrafts)
      .set(updates)
      .where(
        and(
          eq(replyDrafts.id, input.draftId),
          eq(replyDrafts.organizationId, input.scope.organizationId),
          eq(replyDrafts.workspaceId, input.scope.workspaceId),
        ),
      )
      .returning();

    return rows[0] ?? null;
  }
}
