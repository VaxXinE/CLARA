import { and, eq } from "drizzle-orm";
import type { Database } from "../../db/client";
import { emailOutboundDeliveries } from "../../db/schema";
import type { EmailOutboundDeliveryRepository } from "./email-outbound-delivery-repository";
import {
  normalizeEmailOutboundDeliveryInput,
  sanitizeEmailOutboundDeliveryMetadata,
} from "./email-outbound-delivery-repository";
import type {
  EmailOutboundDeliveryMetadata,
  EmailOutboundDeliveryRecord,
  RecordEmailOutboundDeliveryInput,
} from "./email-outbound-delivery-types";
import { createPrefixedId } from "./email-inbound-repository";

type PersistedDeliveryRow = {
  id: string;
  organizationId: string;
  workspaceId: string;
  conversationId: string;
  customerId: string | null;
  replyId: string | null;
  actorUserId: string;
  channel: "email";
  provider: string;
  providerMessageId: string | null;
  providerThreadId: string | null;
  idempotencyKey: string | null;
  status: "simulated" | "sent" | "failed";
  failureCode: string | null;
  metadata: EmailOutboundDeliveryMetadata;
  sentAt: Date | null;
  failedAt: Date | null;
  createdAt: Date;
};

function toRecord(
  row: PersistedDeliveryRow,
  alreadyRecorded: boolean,
): EmailOutboundDeliveryRecord {
  return {
    ...row,
    metadata: sanitizeEmailOutboundDeliveryMetadata(row.metadata),
    alreadyRecorded,
  };
}

async function findScopedExistingByIdempotency(
  db: Database,
  input: ReturnType<typeof normalizeEmailOutboundDeliveryInput>,
): Promise<PersistedDeliveryRow | null> {
  if (!input.idempotencyKey) {
    return null;
  }

  const rows = await db
    .select()
    .from(emailOutboundDeliveries)
    .where(
      and(
        eq(emailOutboundDeliveries.organizationId, input.scope.organizationId),
        eq(emailOutboundDeliveries.workspaceId, input.scope.workspaceId),
        eq(emailOutboundDeliveries.idempotencyKey, input.idempotencyKey),
      ),
    )
    .limit(1);

  return (rows[0] as PersistedDeliveryRow | undefined) ?? null;
}

async function findScopedExistingByProviderMessage(
  db: Database,
  input: ReturnType<typeof normalizeEmailOutboundDeliveryInput>,
): Promise<PersistedDeliveryRow | null> {
  if (!input.providerMessageId) {
    return null;
  }

  const rows = await db
    .select()
    .from(emailOutboundDeliveries)
    .where(
      and(
        eq(emailOutboundDeliveries.organizationId, input.scope.organizationId),
        eq(emailOutboundDeliveries.workspaceId, input.scope.workspaceId),
        eq(emailOutboundDeliveries.provider, input.provider),
        eq(emailOutboundDeliveries.providerMessageId, input.providerMessageId),
      ),
    )
    .limit(1);

  return (rows[0] as PersistedDeliveryRow | undefined) ?? null;
}

export class DrizzleEmailOutboundDeliveryRepository implements EmailOutboundDeliveryRepository {
  constructor(private readonly db: Database) {}

  async recordDelivery(
    input: RecordEmailOutboundDeliveryInput,
  ): Promise<EmailOutboundDeliveryRecord> {
    const normalized = normalizeEmailOutboundDeliveryInput(input);

    return this.db.transaction(async (tx) => {
      const database = tx as Database;
      const existingByIdempotency = await findScopedExistingByIdempotency(
        database,
        normalized,
      );

      if (existingByIdempotency) {
        return toRecord(existingByIdempotency, true);
      }

      const existingByProviderMessage =
        await findScopedExistingByProviderMessage(database, normalized);

      if (existingByProviderMessage) {
        return toRecord(existingByProviderMessage, true);
      }

      const createdAt = new Date();
      const row: PersistedDeliveryRow = {
        id: createPrefixedId("email_outbound"),
        organizationId: normalized.scope.organizationId,
        workspaceId: normalized.scope.workspaceId,
        conversationId: normalized.conversationId,
        customerId: normalized.customerId ?? null,
        replyId: normalized.replyId ?? null,
        actorUserId: normalized.actorUserId,
        channel: "email",
        provider: normalized.provider,
        providerMessageId: normalized.providerMessageId ?? null,
        providerThreadId: normalized.providerThreadId ?? null,
        idempotencyKey: normalized.idempotencyKey ?? null,
        status: normalized.status,
        failureCode:
          normalized.status === "failed" ? normalized.failureCode : null,
        metadata: sanitizeEmailOutboundDeliveryMetadata(normalized.metadata),
        sentAt: normalized.status === "failed" ? null : normalized.sentAt,
        failedAt: normalized.status === "failed" ? normalized.failedAt : null,
        createdAt,
      };

      await tx.insert(emailOutboundDeliveries).values(row);

      return toRecord(row, false);
    });
  }

  async findByIdScoped(
    scope: RecordEmailOutboundDeliveryInput["scope"],
    deliveryId: string,
  ): Promise<EmailOutboundDeliveryRecord | null> {
    const rows = await this.db
      .select()
      .from(emailOutboundDeliveries)
      .where(
        and(
          eq(emailOutboundDeliveries.organizationId, scope.organizationId),
          eq(emailOutboundDeliveries.workspaceId, scope.workspaceId),
          eq(emailOutboundDeliveries.id, deliveryId),
        ),
      )
      .limit(1);

    const row = rows[0] as PersistedDeliveryRow | undefined;

    return row ? toRecord(row, true) : null;
  }
}
