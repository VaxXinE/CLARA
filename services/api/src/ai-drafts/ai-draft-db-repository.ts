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
  AiDraftRepository,
  CreateAiDraftArtifactsInput,
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
}
