import type { InferInsertModel } from "drizzle-orm";
import type { FixtureAppStore } from "../../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../../db/fixtures/fixture-store";
import { webchatOutboundDeliveries } from "../../db/schema";
import { ValidationError } from "../../errors/app-error";
import type { WorkspaceScope } from "../../workspace/workspace-scope";
import { createPrefixedId } from "../email/email-inbound-repository";
import type {
  RecordWebchatOutboundDeliveryInput,
  WebchatOutboundDeliveryMetadata,
  WebchatOutboundDeliveryRecord,
} from "./webchat-outbound-delivery-types";

type WebchatOutboundDeliveryInsert = InferInsertModel<
  typeof webchatOutboundDeliveries
>;

export interface WebchatOutboundDeliveryRepository {
  recordDelivery(
    input: RecordWebchatOutboundDeliveryInput,
  ): Promise<WebchatOutboundDeliveryRecord>;
  findByIdScoped(
    scope: WorkspaceScope,
    deliveryId: string,
  ): Promise<WebchatOutboundDeliveryRecord | null>;
  findLatestByConversationScoped(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<WebchatOutboundDeliveryRecord | null>;
  findChannelAccountIdForConversation(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<string | null>;
}

function cleanOptionalText(value: string | null | undefined): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

export function sanitizeWebchatOutboundMetadata(
  value: unknown,
): WebchatOutboundDeliveryMetadata {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const input = value as WebchatOutboundDeliveryMetadata;
  const metadata: WebchatOutboundDeliveryMetadata = {};

  if (input.source === "webchat_reply_send") {
    metadata.source = input.source;
  }

  if (input.transport === "simulated") {
    metadata.transport = input.transport;
  }

  return metadata;
}

function toRecord(
  row: WebchatOutboundDeliveryInsert,
): WebchatOutboundDeliveryRecord {
  return {
    id: row.id,
    organizationId: row.organizationId,
    workspaceId: row.workspaceId,
    channelAccountId: row.channelAccountId,
    conversationId: row.conversationId,
    replyId: row.replyId ?? null,
    provider: "webchat",
    status: row.status as WebchatOutboundDeliveryRecord["status"],
    reasonCode: row.reasonCode ?? null,
    providerMessageId: row.providerMessageId ?? null,
    sentAt: row.sentAt ?? null,
    metadata: sanitizeWebchatOutboundMetadata(row.metadata),
    createdAt: row.createdAt ?? new Date(),
    updatedAt: row.updatedAt ?? new Date(),
  };
}

function dateValue(value: Date | undefined): Date {
  return value ?? new Date(0);
}

function toInsert(
  input: RecordWebchatOutboundDeliveryInput,
): WebchatOutboundDeliveryInsert {
  if (input.channelAccountId.trim().length === 0) {
    throw new ValidationError("Webchat channel account is required.");
  }

  if (input.conversationId.trim().length === 0) {
    throw new ValidationError("Conversation is required.");
  }

  const now = new Date();

  return {
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
}

export class FixtureWebchatOutboundDeliveryRepository implements WebchatOutboundDeliveryRepository {
  private readonly store: FixtureAppStore;

  constructor(store: FixtureAppStore = createFixtureAppStore()) {
    this.store = store;
  }

  async recordDelivery(
    input: RecordWebchatOutboundDeliveryInput,
  ): Promise<WebchatOutboundDeliveryRecord> {
    const row = toInsert(input);
    this.store.webchatOutboundDeliveries.push(row);

    return toRecord(row);
  }

  async findByIdScoped(
    scope: WorkspaceScope,
    deliveryId: string,
  ): Promise<WebchatOutboundDeliveryRecord | null> {
    const row = this.store.webchatOutboundDeliveries.find(
      (item) =>
        item.organizationId === scope.organizationId &&
        item.workspaceId === scope.workspaceId &&
        item.id === deliveryId,
    );

    return row ? toRecord(row) : null;
  }

  async findLatestByConversationScoped(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<WebchatOutboundDeliveryRecord | null> {
    const row = [...this.store.webchatOutboundDeliveries]
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

    return row ? toRecord(row) : null;
  }

  async findChannelAccountIdForConversation(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<string | null> {
    const record = [...this.store.webchatInboundMessages]
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

    return record?.channelAccountId ?? null;
  }
}
