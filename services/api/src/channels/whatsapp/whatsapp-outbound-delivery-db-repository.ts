import { and, desc, eq } from "drizzle-orm";
import type { Database } from "../../db/client";
import {
  whatsappInboundMessages,
  whatsappOutboundDeliveries,
} from "../../db/schema";
import type { WorkspaceScope } from "../../workspace/workspace-scope";
import { createPrefixedId } from "../email/email-inbound-repository";
import type {
  RecordWhatsappOutboundDeliveryInput,
  WhatsappOutboundDeliveryRecord,
} from "./whatsapp-outbound-delivery-types";
import type { WhatsappOutboundDeliveryRepository } from "./whatsapp-outbound-delivery-repository";
import { sanitizeWhatsappOutboundMetadata } from "./whatsapp-outbound-delivery-repository";

type PersistedWhatsappOutboundDeliveryRow = {
  id: string;
  organizationId: string;
  workspaceId: string;
  channelAccountId: string;
  conversationId: string;
  replyId: string | null;
  provider: string;
  status: WhatsappOutboundDeliveryRecord["status"];
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
  row: PersistedWhatsappOutboundDeliveryRow,
): WhatsappOutboundDeliveryRecord {
  return {
    id: row.id,
    organizationId: row.organizationId,
    workspaceId: row.workspaceId,
    channelAccountId: row.channelAccountId,
    conversationId: row.conversationId,
    replyId: row.replyId,
    provider: "whatsapp",
    status: row.status,
    reasonCode: row.reasonCode,
    providerMessageId: row.providerMessageId,
    sentAt: row.sentAt,
    metadata: sanitizeWhatsappOutboundMetadata(row.metadata),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class DrizzleWhatsappOutboundDeliveryRepository implements WhatsappOutboundDeliveryRepository {
  constructor(private readonly db: Database) {}

  async recordDelivery(
    input: RecordWhatsappOutboundDeliveryInput,
  ): Promise<WhatsappOutboundDeliveryRecord> {
    const now = new Date();
    const row: PersistedWhatsappOutboundDeliveryRow = {
      id: createPrefixedId("whatsapp_outbound"),
      organizationId: input.scope.organizationId,
      workspaceId: input.scope.workspaceId,
      channelAccountId: input.channelAccountId.trim(),
      conversationId: input.conversationId.trim(),
      replyId: cleanOptionalText(input.replyId),
      provider: "whatsapp",
      status: input.status,
      reasonCode: cleanOptionalText(input.reasonCode),
      providerMessageId: cleanOptionalText(input.providerMessageId),
      sentAt: input.sentAt ?? null,
      metadata: sanitizeWhatsappOutboundMetadata(input.metadata),
      createdAt: now,
      updatedAt: now,
    };

    await this.db.insert(whatsappOutboundDeliveries).values(row);

    return toRecord(row);
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    deliveryId: string,
  ): Promise<WhatsappOutboundDeliveryRecord | null> {
    const rows = await this.db
      .select()
      .from(whatsappOutboundDeliveries)
      .where(
        and(
          eq(whatsappOutboundDeliveries.organizationId, scope.organizationId),
          eq(whatsappOutboundDeliveries.workspaceId, scope.workspaceId),
          eq(whatsappOutboundDeliveries.id, deliveryId),
        ),
      )
      .limit(1);

    const row = rows[0] as PersistedWhatsappOutboundDeliveryRow | undefined;

    return row ? toRecord(row) : null;
  }

  async findChannelAccountIdForConversation(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<string | null> {
    const rows = await this.db
      .select({
        channelAccountId: whatsappInboundMessages.channelAccountId,
      })
      .from(whatsappInboundMessages)
      .where(
        and(
          eq(whatsappInboundMessages.organizationId, scope.organizationId),
          eq(whatsappInboundMessages.workspaceId, scope.workspaceId),
          eq(whatsappInboundMessages.conversationId, conversationId),
        ),
      )
      .orderBy(desc(whatsappInboundMessages.createdAt))
      .limit(1);

    return rows[0]?.channelAccountId ?? null;
  }
}
