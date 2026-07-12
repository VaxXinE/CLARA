import { and, asc, eq } from "drizzle-orm";
import type { Database } from "../../db/client";
import {
  activityEvents,
  conversations,
  customers,
  messages,
  webchatInboundMessages,
} from "../../db/schema";
import { ConflictError } from "../../errors/app-error";
import { createPrefixedId } from "../email/email-inbound-repository";
import type {
  PersistWebchatInboundInput,
  PersistWebchatInboundResult,
} from "./webchat-inbound-types";
import {
  assertValidWebchatMessage,
  type WebchatInboundRepository,
} from "./webchat-inbound-repository";

function customerIdentity(input: PersistWebchatInboundInput): string {
  return (
    input.message.customerEmail ??
    `webchat:${input.channelAccountId}:${
      input.message.visitorId ?? input.message.sessionId ?? "anonymous"
    }`
  );
}

function customerDisplayName(input: PersistWebchatInboundInput): string {
  return (
    input.message.customerName ??
    input.message.customerEmail ??
    "Webchat visitor"
  );
}

async function findCustomer(
  db: Database,
  input: PersistWebchatInboundInput,
): Promise<{ id: string } | null> {
  const rows = await db
    .select({ id: customers.id })
    .from(customers)
    .where(
      and(
        eq(customers.organizationId, input.scope.organizationId),
        eq(customers.workspaceId, input.scope.workspaceId),
        eq(customers.contactIdentifier, customerIdentity(input)),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

async function findConversationBySession(
  db: Database,
  input: PersistWebchatInboundInput,
): Promise<{ conversationId: string } | null> {
  if (!input.message.sessionId) {
    return null;
  }

  const rows = await db
    .select({ conversationId: webchatInboundMessages.conversationId })
    .from(webchatInboundMessages)
    .where(
      and(
        eq(webchatInboundMessages.organizationId, input.scope.organizationId),
        eq(webchatInboundMessages.workspaceId, input.scope.workspaceId),
        eq(webchatInboundMessages.channelAccountId, input.channelAccountId),
        eq(webchatInboundMessages.sessionId, input.message.sessionId),
      ),
    )
    .orderBy(asc(webchatInboundMessages.createdAt))
    .limit(1);

  return rows[0] ?? null;
}

async function findConversation(
  db: Database,
  input: PersistWebchatInboundInput,
  conversationId: string,
): Promise<{ customerId: string } | null> {
  const rows = await db
    .select({ customerId: conversations.customerId })
    .from(conversations)
    .where(
      and(
        eq(conversations.id, conversationId),
        eq(conversations.organizationId, input.scope.organizationId),
        eq(conversations.workspaceId, input.scope.workspaceId),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

export class DrizzleWebchatInboundRepository implements WebchatInboundRepository {
  constructor(private readonly db: Database) {}

  async persistInboundMessage(
    input: PersistWebchatInboundInput,
  ): Promise<PersistWebchatInboundResult> {
    assertValidWebchatMessage(input);

    return this.db.transaction(async (tx) => {
      const database = tx as Database;
      const createdAt = new Date();
      const customer = await findCustomer(database, input);
      const customerId = customer?.id ?? createPrefixedId("cust");

      if (!customer) {
        await tx.insert(customers).values({
          id: customerId,
          organizationId: input.scope.organizationId,
          workspaceId: input.scope.workspaceId,
          displayName: customerDisplayName(input),
          contactIdentifier: customerIdentity(input),
          source: "webchat",
          status: "active",
          notesSummary: null,
          lastInteractionAt: input.message.receivedAt,
          createdAt,
          updatedAt: createdAt,
        });
      } else {
        await tx
          .update(customers)
          .set({
            displayName: customerDisplayName(input),
            lastInteractionAt: input.message.receivedAt,
            updatedAt: createdAt,
          })
          .where(
            and(
              eq(customers.id, customerId),
              eq(customers.organizationId, input.scope.organizationId),
              eq(customers.workspaceId, input.scope.workspaceId),
            ),
          );
      }

      const session = await findConversationBySession(database, input);
      const conversationId =
        session?.conversationId ?? createPrefixedId("conv");

      if (!session) {
        await tx.insert(conversations).values({
          id: conversationId,
          organizationId: input.scope.organizationId,
          workspaceId: input.scope.workspaceId,
          customerId,
          source: "webchat",
          status: "open",
          assignedUserId: null,
          lastMessageAt: input.message.receivedAt,
          createdAt: input.message.receivedAt,
          updatedAt: input.message.receivedAt,
        });
      } else {
        const conversation = await findConversation(
          database,
          input,
          conversationId,
        );

        if (!conversation) {
          throw new ConflictError("Webchat session conversation is missing.");
        }

        if (conversation.customerId !== customerId) {
          throw new ConflictError(
            "Webchat session is already linked to another scoped customer.",
          );
        }

        await tx
          .update(conversations)
          .set({
            lastMessageAt: input.message.receivedAt,
            updatedAt: createdAt,
          })
          .where(
            and(
              eq(conversations.id, conversationId),
              eq(conversations.organizationId, input.scope.organizationId),
              eq(conversations.workspaceId, input.scope.workspaceId),
            ),
          );
      }

      const messageId = createPrefixedId("msg");
      const activityId = createPrefixedId("act");
      const webchatInboundId = createPrefixedId("webchat_inbound");

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
        eventType: "webchat_received",
        summary: "Inbound webchat message received.",
        metadata: {
          channel: "webchat",
          channel_account_id: input.channelAccountId,
          visitor_id: input.message.visitorId,
          session_id: input.message.sessionId,
          page_url: input.message.pageUrl,
        },
        createdAt: input.message.receivedAt,
      });
      await tx.insert(webchatInboundMessages).values({
        id: webchatInboundId,
        organizationId: input.scope.organizationId,
        workspaceId: input.scope.workspaceId,
        channelAccountId: input.channelAccountId,
        visitorId: input.message.visitorId,
        sessionId: input.message.sessionId,
        customerId,
        conversationId,
        messageId,
        activityId,
        customerEmail: input.message.customerEmail,
        pageUrl: input.message.pageUrl,
        metadata: input.message.metadata,
        receivedAt: input.message.receivedAt,
        createdAt,
      });

      return {
        customerId,
        conversationId,
        messageId,
        activityId,
        webchatInboundId,
      };
    });
  }
}
