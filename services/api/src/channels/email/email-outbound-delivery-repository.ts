import type { InferInsertModel } from "drizzle-orm";
import type { FixtureAppStore } from "../../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../../db/fixtures/fixture-store";
import { emailOutboundDeliveries } from "../../db/schema";
import { ValidationError } from "../../errors/app-error";
import { createPrefixedId } from "./email-inbound-repository";
import type {
  EmailOutboundDeliveryMetadata,
  EmailOutboundDeliveryRecord,
  RecordEmailOutboundDeliveryInput,
} from "./email-outbound-delivery-types";

type EmailOutboundDeliveryInsert = InferInsertModel<
  typeof emailOutboundDeliveries
>;

export interface EmailOutboundDeliveryRepository {
  recordDelivery(
    input: RecordEmailOutboundDeliveryInput,
  ): Promise<EmailOutboundDeliveryRecord>;
  findByIdScoped(
    scope: RecordEmailOutboundDeliveryInput["scope"],
    deliveryId: string,
  ): Promise<EmailOutboundDeliveryRecord | null>;
}

function normalizeText(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new ValidationError(`${fieldName} cannot be empty.`);
  }

  return normalized;
}

function normalizeOptionalText(
  value: string | null | undefined,
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();

  return normalized.length === 0 ? null : normalized;
}

export function sanitizeEmailOutboundDeliveryMetadata(
  metadata: EmailOutboundDeliveryMetadata | undefined,
): EmailOutboundDeliveryMetadata {
  const safeMetadata: EmailOutboundDeliveryMetadata = {};

  if (
    metadata?.source === "email_reply_adapter" ||
    metadata?.source === "gmail_outbound_send"
  ) {
    safeMetadata.source = metadata.source;
  }

  if (metadata?.transport === "simulated" || metadata?.transport === "gmail") {
    safeMetadata.transport = metadata.transport;
  }

  return safeMetadata;
}

export function normalizeEmailOutboundDeliveryInput(
  input: RecordEmailOutboundDeliveryInput,
): RecordEmailOutboundDeliveryInput {
  const base = {
    scope: input.scope,
    conversationId: normalizeText(input.conversationId, "conversationId"),
    actorUserId: normalizeText(input.actorUserId, "actorUserId"),
    provider: normalizeText(input.provider, "provider"),
    customerId: normalizeOptionalText(input.customerId),
    replyId: normalizeOptionalText(input.replyId),
    providerThreadId: normalizeOptionalText(input.providerThreadId),
    idempotencyKey: normalizeOptionalText(input.idempotencyKey),
    metadata: sanitizeEmailOutboundDeliveryMetadata(input.metadata),
  };

  if (input.status === "failed") {
    return {
      ...base,
      status: "failed",
      providerMessageId: normalizeOptionalText(input.providerMessageId),
      failureCode: normalizeText(input.failureCode, "failureCode"),
      failedAt: input.failedAt,
    };
  }

  const providerMessageId = normalizeText(
    input.providerMessageId,
    "providerMessageId",
  );

  return {
    ...base,
    status: input.status,
    providerMessageId,
    sentAt: input.sentAt,
  };
}

function toRecord(
  row: EmailOutboundDeliveryInsert,
  alreadyRecorded: boolean,
): EmailOutboundDeliveryRecord {
  return {
    id: row.id,
    organizationId: row.organizationId,
    workspaceId: row.workspaceId,
    conversationId: row.conversationId,
    customerId: row.customerId ?? null,
    replyId: row.replyId ?? null,
    actorUserId: row.actorUserId,
    channel: "email",
    provider: row.provider,
    providerMessageId: row.providerMessageId ?? null,
    providerThreadId: row.providerThreadId ?? null,
    idempotencyKey: row.idempotencyKey ?? null,
    status: row.status as EmailOutboundDeliveryRecord["status"],
    failureCode: row.failureCode ?? null,
    metadata: sanitizeEmailOutboundDeliveryMetadata(
      row.metadata as EmailOutboundDeliveryMetadata | undefined,
    ),
    sentAt: row.sentAt ?? null,
    failedAt: row.failedAt ?? null,
    createdAt: row.createdAt ?? new Date(),
    alreadyRecorded,
  };
}

function buildDeliveryRow(
  input: RecordEmailOutboundDeliveryInput,
  createdAt: Date,
): EmailOutboundDeliveryInsert {
  const normalized = normalizeEmailOutboundDeliveryInput(input);

  if (normalized.status === "failed") {
    return {
      id: createPrefixedId("email_outbound"),
      organizationId: normalized.scope.organizationId,
      workspaceId: normalized.scope.workspaceId,
      conversationId: normalized.conversationId,
      customerId: normalized.customerId,
      replyId: normalized.replyId,
      actorUserId: normalized.actorUserId,
      channel: "email",
      provider: normalized.provider,
      providerMessageId: normalized.providerMessageId ?? null,
      providerThreadId: normalized.providerThreadId ?? null,
      idempotencyKey: normalized.idempotencyKey ?? null,
      status: "failed",
      failureCode: normalized.failureCode,
      metadata: normalized.metadata ?? {},
      sentAt: null,
      failedAt: normalized.failedAt,
      createdAt,
    };
  }

  return {
    id: createPrefixedId("email_outbound"),
    organizationId: normalized.scope.organizationId,
    workspaceId: normalized.scope.workspaceId,
    conversationId: normalized.conversationId,
    customerId: normalized.customerId,
    replyId: normalized.replyId,
    actorUserId: normalized.actorUserId,
    channel: "email",
    provider: normalized.provider,
    providerMessageId: normalized.providerMessageId ?? null,
    providerThreadId: normalized.providerThreadId ?? null,
    idempotencyKey: normalized.idempotencyKey ?? null,
    status: normalized.status,
    failureCode: null,
    metadata: normalized.metadata ?? {},
    sentAt: normalized.sentAt,
    failedAt: null,
    createdAt,
  };
}

function findScopedExistingRecord(
  store: FixtureAppStore,
  row: EmailOutboundDeliveryInsert,
): EmailOutboundDeliveryInsert | undefined {
  if (row.idempotencyKey) {
    const existingByIdempotency = store.emailOutboundDeliveries.find(
      (record) =>
        record.organizationId === row.organizationId &&
        record.workspaceId === row.workspaceId &&
        record.idempotencyKey === row.idempotencyKey,
    );

    if (existingByIdempotency) {
      return existingByIdempotency;
    }
  }

  if (row.providerMessageId) {
    return store.emailOutboundDeliveries.find(
      (record) =>
        record.organizationId === row.organizationId &&
        record.workspaceId === row.workspaceId &&
        record.provider === row.provider &&
        record.providerMessageId === row.providerMessageId,
    );
  }

  return undefined;
}

export class FixtureEmailOutboundDeliveryRepository implements EmailOutboundDeliveryRepository {
  private readonly store: FixtureAppStore;

  constructor(store: FixtureAppStore = createFixtureAppStore()) {
    this.store = store;
  }

  async recordDelivery(
    input: RecordEmailOutboundDeliveryInput,
  ): Promise<EmailOutboundDeliveryRecord> {
    const row = buildDeliveryRow(input, new Date());
    const existing = findScopedExistingRecord(this.store, row);

    if (existing) {
      return toRecord(existing, true);
    }

    this.store.emailOutboundDeliveries.push(row);

    return toRecord(row, false);
  }

  async findByIdScoped(
    scope: RecordEmailOutboundDeliveryInput["scope"],
    deliveryId: string,
  ): Promise<EmailOutboundDeliveryRecord | null> {
    const record = this.store.emailOutboundDeliveries.find(
      (item) =>
        item.organizationId === scope.organizationId &&
        item.workspaceId === scope.workspaceId &&
        item.id === deliveryId,
    );

    return record ? toRecord(record, true) : null;
  }
}
