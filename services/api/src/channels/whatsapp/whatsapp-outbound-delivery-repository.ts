import type { InferInsertModel } from "drizzle-orm";
import type { FixtureAppStore } from "../../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../../db/fixtures/fixture-store";
import {
  whatsappInboundMessages,
  whatsappOutboundDeliveries,
} from "../../db/schema";
import { ValidationError } from "../../errors/app-error";
import type { WorkspaceScope } from "../../workspace/workspace-scope";
import { createPrefixedId } from "../email/email-inbound-repository";
import type {
  RecordWhatsappOutboundDeliveryInput,
  WhatsappOutboundDeliveryMetadata,
  WhatsappOutboundDeliveryRecord,
} from "./whatsapp-outbound-delivery-types";

type WhatsappOutboundDeliveryInsert = InferInsertModel<
  typeof whatsappOutboundDeliveries
>;

export interface WhatsappOutboundDeliveryRepository {
  recordDelivery(
    input: RecordWhatsappOutboundDeliveryInput,
  ): Promise<WhatsappOutboundDeliveryRecord>;
  findByIdScoped(
    scope: WorkspaceScope,
    deliveryId: string,
  ): Promise<WhatsappOutboundDeliveryRecord | null>;
  findChannelAccountIdForConversation(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<string | null>;
}

function cleanOptionalText(value: string | null | undefined): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

export function sanitizeWhatsappOutboundMetadata(
  value: unknown,
): WhatsappOutboundDeliveryMetadata {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const input = value as WhatsappOutboundDeliveryMetadata;
  const metadata: WhatsappOutboundDeliveryMetadata = {};

  if (input.source === "whatsapp_reply_send") {
    metadata.source = input.source;
  }

  if (input.transport === "simulated") {
    metadata.transport = input.transport;
  }

  if (
    typeof input.recipient_count === "number" &&
    Number.isInteger(input.recipient_count) &&
    input.recipient_count >= 0
  ) {
    metadata.recipient_count = input.recipient_count;
  }

  return metadata;
}

function dateValue(value: Date | undefined): Date {
  return value ?? new Date(0);
}

function toRecord(
  row: WhatsappOutboundDeliveryInsert,
): WhatsappOutboundDeliveryRecord {
  return {
    id: row.id,
    organizationId: row.organizationId,
    workspaceId: row.workspaceId,
    channelAccountId: row.channelAccountId,
    conversationId: row.conversationId,
    replyId: row.replyId ?? null,
    provider: "whatsapp",
    status: row.status as WhatsappOutboundDeliveryRecord["status"],
    reasonCode: row.reasonCode ?? null,
    providerMessageId: row.providerMessageId ?? null,
    sentAt: row.sentAt ?? null,
    metadata: sanitizeWhatsappOutboundMetadata(row.metadata),
    createdAt: row.createdAt ?? new Date(),
    updatedAt: row.updatedAt ?? new Date(),
  };
}

function toInsert(
  input: RecordWhatsappOutboundDeliveryInput,
): WhatsappOutboundDeliveryInsert {
  if (input.channelAccountId.trim().length === 0) {
    throw new ValidationError("WhatsApp channel account is required.");
  }

  if (input.conversationId.trim().length === 0) {
    throw new ValidationError("Conversation is required.");
  }

  const now = new Date();

  return {
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
}

export class FixtureWhatsappOutboundDeliveryRepository implements WhatsappOutboundDeliveryRepository {
  constructor(
    private readonly store: FixtureAppStore = createFixtureAppStore(),
  ) {}

  async recordDelivery(
    input: RecordWhatsappOutboundDeliveryInput,
  ): Promise<WhatsappOutboundDeliveryRecord> {
    const row = toInsert(input);
    this.store.whatsappOutboundDeliveries.push(row);

    return toRecord(row);
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    deliveryId: string,
  ): Promise<WhatsappOutboundDeliveryRecord | null> {
    const row = this.store.whatsappOutboundDeliveries.find(
      (item) =>
        item.organizationId === scope.organizationId &&
        item.workspaceId === scope.workspaceId &&
        item.id === deliveryId,
    );

    return row ? toRecord(row) : null;
  }

  async findChannelAccountIdForConversation(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<string | null> {
    const row = [...this.store.whatsappInboundMessages]
      .filter(
        (item) =>
          item.organizationId === scope.organizationId &&
          item.workspaceId === scope.workspaceId &&
          item.conversationId === conversationId,
      )
      .sort(
        (left, right) =>
          dateValue(right.createdAt).getTime() -
          dateValue(left.createdAt).getTime(),
      )[0];

    return row?.channelAccountId ?? null;
  }
}
