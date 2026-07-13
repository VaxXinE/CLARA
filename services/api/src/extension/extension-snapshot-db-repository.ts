import { and, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import {
  activityEvents,
  conversations,
  customers,
  extensionSnapshotMessages,
  extensionSnapshots,
  messages,
} from "../db/schema";
import { createPrefixedId } from "../channels/email/email-inbound-repository";
import type {
  PersistExtensionSnapshotInput,
  PersistExtensionSnapshotResult,
} from "./extension-snapshot-types";
import {
  countSnapshotDirections,
  createExtensionConversationFingerprint,
  createExtensionSnapshotId,
  createExtensionSnapshotMessageId,
  type ExtensionSnapshotRepository,
} from "./extension-snapshot-repository";

function extensionContactIdentifier(input: PersistExtensionSnapshotInput) {
  return `extension:${input.snapshot.channel}:${createExtensionConversationFingerprint(input.snapshot)}`;
}

async function findCustomer(
  db: Database,
  input: PersistExtensionSnapshotInput,
) {
  const rows = await db
    .select({ id: customers.id })
    .from(customers)
    .where(
      and(
        eq(customers.organizationId, input.scope.organizationId),
        eq(customers.workspaceId, input.scope.workspaceId),
        eq(customers.contactIdentifier, extensionContactIdentifier(input)),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

async function findSnapshotByFingerprint(
  db: Database,
  input: PersistExtensionSnapshotInput,
  fingerprint: string,
) {
  const rows = await db
    .select({
      conversationId: extensionSnapshots.conversationId,
      customerId: extensionSnapshots.customerId,
    })
    .from(extensionSnapshots)
    .where(
      and(
        eq(extensionSnapshots.organizationId, input.scope.organizationId),
        eq(extensionSnapshots.workspaceId, input.scope.workspaceId),
        eq(extensionSnapshots.channel, input.snapshot.channel),
        eq(extensionSnapshots.conversationFingerprint, fingerprint),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

async function findDuplicateSnapshot(
  db: Database,
  input: PersistExtensionSnapshotInput,
  fingerprint: string,
) {
  const rows = await db
    .select({
      id: extensionSnapshots.id,
      conversationId: extensionSnapshots.conversationId,
      customerId: extensionSnapshots.customerId,
      messageCount: extensionSnapshots.messageCount,
      incomingCount: extensionSnapshots.incomingCount,
      outgoingCount: extensionSnapshots.outgoingCount,
      capturedAt: extensionSnapshots.capturedAt,
    })
    .from(extensionSnapshots)
    .where(
      and(
        eq(extensionSnapshots.organizationId, input.scope.organizationId),
        eq(extensionSnapshots.workspaceId, input.scope.workspaceId),
        eq(extensionSnapshots.channel, input.snapshot.channel),
        eq(extensionSnapshots.conversationFingerprint, fingerprint),
        eq(extensionSnapshots.snapshotHash, input.snapshot.snapshotHash),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

async function hasLocalMessage(
  db: Database,
  input: PersistExtensionSnapshotInput,
  conversationId: string,
  localMessageId: string,
) {
  const rows = await db
    .select({ id: extensionSnapshotMessages.id })
    .from(extensionSnapshotMessages)
    .where(
      and(
        eq(
          extensionSnapshotMessages.organizationId,
          input.scope.organizationId,
        ),
        eq(extensionSnapshotMessages.workspaceId, input.scope.workspaceId),
        eq(extensionSnapshotMessages.channel, input.snapshot.channel),
        eq(extensionSnapshotMessages.conversationId, conversationId),
        eq(extensionSnapshotMessages.localMessageId, localMessageId),
      ),
    )
    .limit(1);

  return Boolean(rows[0]);
}

export class DrizzleExtensionSnapshotRepository implements ExtensionSnapshotRepository {
  constructor(private readonly db: Database) {}

  async persistSnapshot(
    input: PersistExtensionSnapshotInput,
  ): Promise<PersistExtensionSnapshotResult> {
    const fingerprint = createExtensionConversationFingerprint(input.snapshot);
    const duplicate = await findDuplicateSnapshot(this.db, input, fingerprint);

    if (duplicate?.conversationId && duplicate.customerId) {
      return {
        snapshotId: duplicate.id,
        status: "duplicate",
        duplicate: true,
        channel: input.snapshot.channel,
        snapshotHash: input.snapshot.snapshotHash,
        conversationFingerprint: fingerprint,
        conversationId: duplicate.conversationId,
        customerId: duplicate.customerId,
        messageCount: duplicate.messageCount,
        persistedMessageCount: 0,
        incomingCount: duplicate.incomingCount,
        outgoingCount: duplicate.outgoingCount,
        capturedAt: duplicate.capturedAt,
      };
    }

    return this.db.transaction(async (tx) => {
      const database = tx as Database;
      const now = new Date();
      const counts = countSnapshotDirections(input.snapshot);
      const customer = await findCustomer(database, input);
      const customerId = customer?.id ?? createPrefixedId("cust");

      if (!customer) {
        await tx.insert(customers).values({
          id: customerId,
          organizationId: input.scope.organizationId,
          workspaceId: input.scope.workspaceId,
          displayName: input.snapshot.chatTitle,
          contactIdentifier: extensionContactIdentifier(input),
          source: "extension_bridge",
          status: "active",
          notesSummary: input.snapshot.chatSubtitle,
          lastInteractionAt: input.snapshot.capturedAt,
          createdAt: now,
          updatedAt: now,
        });
      } else {
        await tx
          .update(customers)
          .set({
            displayName: input.snapshot.chatTitle,
            notesSummary: input.snapshot.chatSubtitle,
            lastInteractionAt: input.snapshot.capturedAt,
            updatedAt: now,
          })
          .where(
            and(
              eq(customers.id, customerId),
              eq(customers.organizationId, input.scope.organizationId),
              eq(customers.workspaceId, input.scope.workspaceId),
            ),
          );
      }

      const previous = await findSnapshotByFingerprint(
        database,
        input,
        fingerprint,
      );
      const conversationId =
        previous?.conversationId ?? createPrefixedId("conv");

      if (!previous?.conversationId) {
        await tx.insert(conversations).values({
          id: conversationId,
          organizationId: input.scope.organizationId,
          workspaceId: input.scope.workspaceId,
          customerId,
          source: "extension_bridge",
          status: "open",
          assignedUserId: null,
          lastMessageAt: input.snapshot.capturedAt,
          createdAt: input.snapshot.capturedAt,
          updatedAt: now,
        });
      } else {
        await tx
          .update(conversations)
          .set({
            lastMessageAt: input.snapshot.capturedAt,
            updatedAt: now,
          })
          .where(
            and(
              eq(conversations.id, conversationId),
              eq(conversations.organizationId, input.scope.organizationId),
              eq(conversations.workspaceId, input.scope.workspaceId),
            ),
          );
      }

      const snapshotId = createExtensionSnapshotId();

      await tx.insert(extensionSnapshots).values({
        id: snapshotId,
        organizationId: input.scope.organizationId,
        workspaceId: input.scope.workspaceId,
        channel: input.snapshot.channel,
        provider: "extension",
        officialApi: 0,
        snapshotHash: input.snapshot.snapshotHash,
        conversationFingerprint: fingerprint,
        chatTitle: input.snapshot.chatTitle,
        chatSubtitle: input.snapshot.chatSubtitle,
        sourceUrlOrigin: input.snapshot.sourceUrlOrigin,
        messageCount: input.snapshot.messages.length,
        incomingCount: counts.incomingCount,
        outgoingCount: counts.outgoingCount,
        capturedAt: input.snapshot.capturedAt,
        status: "accepted",
        conversationId,
        customerId,
        safeMetadata: {
          provider: "extension",
          channel: input.snapshot.channel,
          source: "extension_bridge",
        },
        createdAt: now,
        updatedAt: now,
      });

      let persistedMessageCount = 0;

      for (const [
        index,
        snapshotMessage,
      ] of input.snapshot.messages.entries()) {
        if (
          await hasLocalMessage(
            database,
            input,
            conversationId,
            snapshotMessage.id,
          )
        ) {
          continue;
        }

        const messageId = createPrefixedId("msg");

        await tx.insert(messages).values({
          id: messageId,
          organizationId: input.scope.organizationId,
          workspaceId: input.scope.workspaceId,
          conversationId,
          direction:
            snapshotMessage.direction === "incoming" ? "inbound" : "outbound",
          senderType:
            snapshotMessage.direction === "incoming" ? "customer" : "agent",
          senderUserId: null,
          body: snapshotMessage.text,
          sentAt: input.snapshot.capturedAt,
          deliveryStatus:
            snapshotMessage.direction === "incoming" ? "received" : "sent",
          createdAt: now,
        });

        await tx.insert(extensionSnapshotMessages).values({
          id: createExtensionSnapshotMessageId(),
          organizationId: input.scope.organizationId,
          workspaceId: input.scope.workspaceId,
          snapshotId,
          conversationId,
          messageId,
          channel: input.snapshot.channel,
          localMessageId: snapshotMessage.id,
          direction: snapshotMessage.direction,
          author: snapshotMessage.author,
          text: snapshotMessage.text,
          timestampLabel: snapshotMessage.timestampLabel,
          replyContextText: snapshotMessage.replyContextText,
          sortOrder: index,
          createdAt: now,
        });

        persistedMessageCount += 1;
      }

      await tx.insert(activityEvents).values({
        id: createPrefixedId("act"),
        organizationId: input.scope.organizationId,
        workspaceId: input.scope.workspaceId,
        conversationId,
        actorUserId: input.auth.userId,
        eventType: "extension_snapshot_received",
        summary: "Extension bridge snapshot received.",
        metadata: {
          provider: "extension",
          channel: input.snapshot.channel,
          source: "extension_bridge",
          snapshot_hash: input.snapshot.snapshotHash,
          message_count: input.snapshot.messages.length,
        },
        createdAt: input.snapshot.capturedAt,
      });

      return {
        snapshotId,
        status: "accepted",
        duplicate: false,
        channel: input.snapshot.channel,
        snapshotHash: input.snapshot.snapshotHash,
        conversationFingerprint: fingerprint,
        conversationId,
        customerId,
        messageCount: input.snapshot.messages.length,
        persistedMessageCount,
        incomingCount: counts.incomingCount,
        outgoingCount: counts.outgoingCount,
        capturedAt: input.snapshot.capturedAt,
      };
    });
  }
}
