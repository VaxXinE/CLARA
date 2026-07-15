import { randomUUID } from "node:crypto";
import type { InferInsertModel } from "drizzle-orm";
import type { FixtureAppStore } from "../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../db/fixtures/fixture-store";
import { activityEvents, aiDraftEvents, replyDrafts } from "../db/schema";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type { CreatedAiDraftRecord } from "./ai-draft-dto";

type ReplyDraftInsert = InferInsertModel<typeof replyDrafts>;
type AiDraftEventInsert = InferInsertModel<typeof aiDraftEvents>;
type ActivityEventInsert = InferInsertModel<typeof activityEvents>;

export type CreateAiDraftArtifactsInput = {
  scope: WorkspaceScope;
  conversationId: string;
  createdByUserId: string;
  draftBody: string;
  provider: string;
  model: string;
  promptVersion: string;
  latencyMs: number | null;
};

export type AiDraftReviewRecord = {
  id: string;
  organizationId: string;
  workspaceId: string;
  conversationId: string;
  createdByUserId: string;
  draftBody: string;
  source: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateAiDraftReviewInput = {
  scope: WorkspaceScope;
  draftId: string;
  draftBody?: string;
  status?: string;
};

export interface AiDraftRepository {
  createDraftArtifacts(
    input: CreateAiDraftArtifactsInput,
  ): Promise<CreatedAiDraftRecord>;
  findDraftByIdScoped(
    scope: WorkspaceScope,
    draftId: string,
  ): Promise<AiDraftReviewRecord | null>;
  updateDraftReview(
    input: UpdateAiDraftReviewInput,
  ): Promise<AiDraftReviewRecord | null>;
}

export function createPrefixedId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

export function buildReplyDraftRow(
  input: CreateAiDraftArtifactsInput,
  draftId: string,
  createdAt: Date,
): ReplyDraftInsert {
  return {
    id: draftId,
    organizationId: input.scope.organizationId,
    workspaceId: input.scope.workspaceId,
    conversationId: input.conversationId,
    createdByUserId: input.createdByUserId,
    draftBody: input.draftBody,
    source: "ai",
    status: "draft",
    createdAt,
    updatedAt: createdAt,
  };
}

export function buildAiDraftEventRow(
  input: CreateAiDraftArtifactsInput,
  aiDraftEventId: string,
  draftId: string,
  createdAt: Date,
): AiDraftEventInsert {
  return {
    id: aiDraftEventId,
    organizationId: input.scope.organizationId,
    workspaceId: input.scope.workspaceId,
    conversationId: input.conversationId,
    replyDraftId: draftId,
    createdByUserId: input.createdByUserId,
    promptVersion: input.promptVersion,
    provider: input.provider,
    model: input.model,
    latencyMs: input.latencyMs,
    status: "succeeded",
    createdAt,
  };
}

export function buildActivityEventRow(
  input: CreateAiDraftArtifactsInput,
  activityEventId: string,
  draftId: string,
  createdAt: Date,
): ActivityEventInsert {
  return {
    id: activityEventId,
    organizationId: input.scope.organizationId,
    workspaceId: input.scope.workspaceId,
    conversationId: input.conversationId,
    actorUserId: input.createdByUserId,
    eventType: "ai_draft_generated",
    summary: "AI draft generated for conversation review.",
    metadata: {
      draft_id: draftId,
      prompt_version: input.promptVersion,
      provider: input.provider,
      model: input.model,
      latency_ms: input.latencyMs,
    },
    createdAt,
  };
}

export function toCreatedAiDraftRecord(input: {
  draftId: string;
  conversationId: string;
  draftBody: string;
  createdAt: Date;
  provider: string;
  model: string;
}): CreatedAiDraftRecord {
  return {
    id: input.draftId,
    conversationId: input.conversationId,
    body: input.draftBody,
    status: "draft",
    createdAt: input.createdAt,
    provider: input.provider,
    model: input.model,
  };
}

function toAiDraftReviewRecord(draft: ReplyDraftInsert): AiDraftReviewRecord {
  return {
    id: draft.id,
    organizationId: draft.organizationId,
    workspaceId: draft.workspaceId,
    conversationId: draft.conversationId,
    createdByUserId: draft.createdByUserId,
    draftBody: draft.draftBody,
    source: draft.source,
    status: draft.status,
    createdAt: draft.createdAt ?? new Date(),
    updatedAt: draft.updatedAt ?? draft.createdAt ?? new Date(),
  };
}

export class FixtureAiDraftRepository implements AiDraftRepository {
  private readonly store: FixtureAppStore;

  constructor(store: FixtureAppStore = createFixtureAppStore()) {
    this.store = store;
  }

  async createDraftArtifacts(
    input: CreateAiDraftArtifactsInput,
  ): Promise<CreatedAiDraftRecord> {
    const createdAt = new Date();
    const draftId = createPrefixedId("draft");
    const aiDraftEventId = createPrefixedId("ai_evt");
    const activityEventId = createPrefixedId("act");

    this.store.replyDrafts.push(buildReplyDraftRow(input, draftId, createdAt));
    this.store.aiDraftEvents.push(
      buildAiDraftEventRow(input, aiDraftEventId, draftId, createdAt),
    );
    this.store.activityEvents.push(
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
  }

  async findDraftByIdScoped(
    scope: WorkspaceScope,
    draftId: string,
  ): Promise<AiDraftReviewRecord | null> {
    const draft = this.store.replyDrafts.find((candidate) => {
      return (
        candidate.id === draftId &&
        candidate.organizationId === scope.organizationId &&
        candidate.workspaceId === scope.workspaceId
      );
    });

    return draft ? toAiDraftReviewRecord(draft) : null;
  }

  async updateDraftReview(
    input: UpdateAiDraftReviewInput,
  ): Promise<AiDraftReviewRecord | null> {
    const draft = this.store.replyDrafts.find((candidate) => {
      return (
        candidate.id === input.draftId &&
        candidate.organizationId === input.scope.organizationId &&
        candidate.workspaceId === input.scope.workspaceId
      );
    });

    if (!draft) {
      return null;
    }

    if (input.draftBody !== undefined) {
      draft.draftBody = input.draftBody;
    }

    if (input.status !== undefined) {
      draft.status = input.status;
    }

    draft.updatedAt = new Date();

    return toAiDraftReviewRecord(draft);
  }

  getState(): FixtureAppStore {
    return structuredClone(this.store);
  }
}
