import { and, desc, eq } from "drizzle-orm";
import type { Database } from "../../db/client";
import {
  webchatInboundMessages,
  webchatOutboundDeliveries,
} from "../../db/schema";
import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type {
  RecordWebchatOutboundDeliveryInput,
  WebchatOutboundDeliveryRecord,
} from "./webchat-outbound-delivery-types";
import type { WebchatOutboundDeliveryRepository } from "./webchat-outbound-delivery-repository";
import { sanitizeWebchatOutboundMetadata } from "./webchat-outbound-delivery-repository";
import { createPrefixedId } from "../email/email-inbound-repository";

type PersistedWebchatOutboundDeliveryRow = {
  id: string;
  organizationId: string;
  workspaceId: string;
  channelAccountId: string;
  conversationId: string;
  replyId: string | null;
  provider: string;
  status: WebchatOutboundDeliveryRecord["status"];
  reasonCode: string | null;
  providerMessageId: string | null;
  sentAt: Date | null;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
};

function cleanOptionalText(value: string | null | undefined): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

function toRecord(
  row: PersistedWebchatOutboundDeliveryRow,
): WebchatOutboundDeliveryRecord {
  return {
    id: row.id,
    organizationId: row.organizationId,
    workspaceId: row.workspaceId,
    channelAccountId: row.channelAccountId,
    conversationId: row.conversationId,
    replyId: row.replyId,
    provider: "webchat",
    status: row.status,
    reasonCode: row.reasonCode,
    providerMessageId: row.providerMessageId,
    sentAt: row.sentAt,
    metadata: sanitizeWebchatOutboundMetadata(row.metadata),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class DrizzleWebchatOutboundDeliveryRepository implements WebchatOutboundDeliveryRepository {
  constructor(private readonly db: Database) {}

  async recordDelivery(
    input: RecordWebchatOutboundDeliveryInput,
  ): Promise<WebchatOutboundDeliveryRecord> {
    const now = new Date();
    const row: PersistedWebchatOutboundDeliveryRow = {
      id: createPrefixedId("webchat_outbound"),
      organizationId: input.scope.organizationId,
      workspaceId: input.scope.workspaceId,
      channelAccountId: input.channelAccountId.trim(),
      conversationId: input.conversationId.trim(),
      replyId: cleanOptionalText(input.replyId),
      provider: "webchat",
      status: input.status,
      reasonCode: cleanOptionalText(input.reasonCode),
      providerMessageId: cleanOptionalText(input.providerMessageId),
      sentAt: input.sentAt ?? null,
      metadata: sanitizeWebchatOutboundMetadata(input.metadata),
      createdAt: now,
      updatedAt: now,
    };

    await this.db.insert(webchatOutboundDeliveries).values(row);

    return toRecord(row);
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    deliveryId: string,
  ): Promise<WebchatOutboundDeliveryRecord | null> {
    const rows = await this.db
      .select()
      .from(webchatOutboundDeliveries)
      .where(
        and(
          eq(webchatOutboundDeliveries.organizationId, scope.organizationId),
          eq(webchatOutboundDeliveries.workspaceId, scope.workspaceId),
          eq(webchatOutboundDeliveries.id, deliveryId),
        ),
      )
      .limit(1);

    const row = rows[0] as PersistedWebchatOutboundDeliveryRow | undefined;

    return row ? toRecord(row) : null;
  }

  async findLatestByConversationScoped(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<WebchatOutboundDeliveryRecord | null> {
    const rows = await this.db
      .select()
      .from(webchatOutboundDeliveries)
      .where(
        and(
          eq(webchatOutboundDeliveries.organizationId, scope.organizationId),
          eq(webchatOutboundDeliveries.workspaceId, scope.workspaceId),
          eq(webchatOutboundDeliveries.conversationId, conversationId),
        ),
      )
      .orderBy(desc(webchatOutboundDeliveries.createdAt))
      .limit(1);

    const row = rows[0] as PersistedWebchatOutboundDeliveryRow | undefined;

    return row ? toRecord(row) : null;
  }

  async findChannelAccountIdForConversation(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<string | null> {
    const rows = await this.db
      .select({
        channelAccountId: webchatInboundMessages.channelAccountId,
      })
      .from(webchatInboundMessages)
      .where(
        and(
          eq(webchatInboundMessages.organizationId, scope.organizationId),
          eq(webchatInboundMessages.workspaceId, scope.workspaceId),
          eq(webchatInboundMessages.conversationId, conversationId),
        ),
      )
      .orderBy(desc(webchatInboundMessages.createdAt))
      .limit(1);

    return rows[0]?.channelAccountId ?? null;
  }
}
