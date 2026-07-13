import { and, eq } from "drizzle-orm";
import type { Database } from "../../db/client";
import {
  activityEvents,
  conversations,
  customers,
  messages,
  whatsappInboundMessages,
} from "../../db/schema";
import { createPrefixedId } from "../email/email-inbound-repository";
import type {
  PersistWhatsappInboundInput,
  PersistWhatsappInboundResult,
} from "./whatsapp-webhook-types";
import type { WhatsappInboundRepository } from "./whatsapp-inbound-repository";

function customerIdentity(input: PersistWhatsappInboundInput): string {
  return `whatsapp:${input.channelAccountId}:${input.message.senderExternalId}`;
}

async function findExisting(db: Database, input: PersistWhatsappInboundInput) {
  const rows = await db
    .select()
    .from(whatsappInboundMessages)
    .where(
      and(
        eq(whatsappInboundMessages.organizationId, input.scope.organizationId),
        eq(whatsappInboundMessages.workspaceId, input.scope.workspaceId),
        eq(
          whatsappInboundMessages.externalMessageId,
          input.message.externalMessageId,
        ),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

export class DrizzleWhatsappInboundRepository implements WhatsappInboundRepository {
  constructor(private readonly db: Database) {}

  async persistInboundMessage(
    input: PersistWhatsappInboundInput,
  ): Promise<PersistWhatsappInboundResult> {
    return this.db.transaction(async (tx) => {
      const database = tx as Database;
      const existing = await findExisting(database, input);

      if (existing) {
        return {
          customerId: existing.customerId,
          conversationId: existing.conversationId,
          messageId: existing.messageId,
          activityId: existing.activityId,
          whatsappInboundId: existing.id,
          duplicate: true,
        };
      }

      const createdAt = new Date();
      const identity = customerIdentity(input);
      const customerRows = await tx
        .select({ id: customers.id })
        .from(customers)
        .where(
          and(
            eq(customers.organizationId, input.scope.organizationId),
            eq(customers.workspaceId, input.scope.workspaceId),
            eq(customers.contactIdentifier, identity),
          ),
        )
        .limit(1);
      const customerId = customerRows[0]?.id ?? createPrefixedId("cust");

      if (!customerRows[0]) {
        await tx.insert(customers).values({
          id: customerId,
          organizationId: input.scope.organizationId,
          workspaceId: input.scope.workspaceId,
          displayName:
            input.message.senderDisplayName ?? input.message.senderExternalId,
          contactIdentifier: identity,
          source: "whatsapp",
          status: "active",
          notesSummary: null,
          lastInteractionAt: input.message.receivedAt,
          createdAt,
          updatedAt: createdAt,
        });
      }

      const conversationId = createPrefixedId("conv");
      const messageId = createPrefixedId("msg");
      const activityId = createPrefixedId("act");
      const whatsappInboundId = createPrefixedId("whatsapp_inbound");

      await tx.insert(conversations).values({
        id: conversationId,
        organizationId: input.scope.organizationId,
        workspaceId: input.scope.workspaceId,
        customerId,
        source: "whatsapp",
        status: "open",
        assignedUserId: null,
        lastMessageAt: input.message.receivedAt,
        createdAt: input.message.receivedAt,
        updatedAt: input.message.receivedAt,
      });
      await tx.insert(messages).values({
        id: messageId,
        organizationId: input.scope.organizationId,
        workspaceId: input.scope.workspaceId,
        conversationId,
        direction: "inbound",
        senderType: "customer",
        senderUserId: null,
        body: input.message.messageText,
        sentAt: input.message.receivedAt,
        deliveryStatus: "received",
        createdAt: input.message.receivedAt,
      });
      await tx.insert(activityEvents).values({
        id: activityId,
        organizationId: input.scope.organizationId,
        workspaceId: input.scope.workspaceId,
        conversationId,
        actorUserId: null,
        eventType: "whatsapp_received",
        summary: "Inbound WhatsApp message received.",
        metadata: {
          channel: "whatsapp",
          channel_account_id: input.channelAccountId,
          external_message_id: input.message.externalMessageId,
        },
        createdAt: input.message.receivedAt,
      });
      await tx.insert(whatsappInboundMessages).values({
        id: whatsappInboundId,
        organizationId: input.scope.organizationId,
        workspaceId: input.scope.workspaceId,
        channelAccountId: input.channelAccountId,
        externalMessageId: input.message.externalMessageId,
        externalConversationId: input.message.externalConversationId,
        senderExternalId: input.message.senderExternalId,
        senderDisplayName: input.message.senderDisplayName,
        customerId,
        conversationId,
        messageId,
        activityId,
        messageText: input.message.messageText,
        metadata: input.message.metadata,
        receivedAt: input.message.receivedAt,
        createdAt,
      });

      return {
        customerId,
        conversationId,
        messageId,
        activityId,
        whatsappInboundId,
        duplicate: false,
      };
    });
  }
}
