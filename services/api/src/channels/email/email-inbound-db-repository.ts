import { and, asc, eq } from "drizzle-orm";
import type { Database } from "../../db/client";
import {
  activityEvents,
  conversations,
  customers,
  emailInboundRecords,
  messages,
} from "../../db/schema";
import { ConflictError } from "../../errors/app-error";
import type {
  EmailInboundRepository,
  PersistInboundEmailInput,
  PersistInboundEmailResult,
} from "./email-inbound-repository";
import {
  assertInboundEmailHasTextBody,
  buildInboundActivityRow,
  buildInboundConversationRow,
  buildInboundCustomerRow,
  buildInboundMessageRow,
  buildInboundRecordRow,
  createPrefixedId,
} from "./email-inbound-repository";

type ScopedEmailInboundRecord = {
  customerId: string;
  conversationId: string;
  activityId: string;
};

async function findScopedInboundRecordByProviderMessage(
  db: Database,
  input: PersistInboundEmailInput,
): Promise<ScopedEmailInboundRecord | null> {
  const rows = await db
    .select({
      customerId: emailInboundRecords.customerId,
      conversationId: emailInboundRecords.conversationId,
      activityId: emailInboundRecords.activityId,
    })
    .from(emailInboundRecords)
    .where(
      and(
        eq(emailInboundRecords.organizationId, input.scope.organizationId),
        eq(emailInboundRecords.workspaceId, input.scope.workspaceId),
        eq(emailInboundRecords.provider, input.email.provider),
        eq(
          emailInboundRecords.providerMessageId,
          input.email.providerMessageId,
        ),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

async function findScopedCustomer(
  db: Database,
  input: PersistInboundEmailInput,
): Promise<{ id: string } | null> {
  const rows = await db
    .select({
      id: customers.id,
    })
    .from(customers)
    .where(
      and(
        eq(customers.organizationId, input.scope.organizationId),
        eq(customers.workspaceId, input.scope.workspaceId),
        eq(customers.contactIdentifier, input.email.fromEmail),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

async function findScopedConversationByProviderThread(
  db: Database,
  input: PersistInboundEmailInput,
): Promise<{ conversationId: string } | null> {
  if (!input.email.threadId) {
    return null;
  }

  const rows = await db
    .select({
      conversationId: emailInboundRecords.conversationId,
    })
    .from(emailInboundRecords)
    .where(
      and(
        eq(emailInboundRecords.organizationId, input.scope.organizationId),
        eq(emailInboundRecords.workspaceId, input.scope.workspaceId),
        eq(emailInboundRecords.provider, input.email.provider),
        eq(emailInboundRecords.providerThreadId, input.email.threadId),
      ),
    )
    .orderBy(asc(emailInboundRecords.createdAt))
    .limit(1);

  return rows[0] ?? null;
}

async function findScopedConversation(
  db: Database,
  input: PersistInboundEmailInput,
  conversationId: string,
): Promise<{ customerId: string | null } | null> {
  const rows = await db
    .select({
      customerId: conversations.customerId,
    })
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

export class DrizzleEmailInboundRepository implements EmailInboundRepository {
  constructor(private readonly db: Database) {}

  async persistInboundEmail(
    input: PersistInboundEmailInput,
  ): Promise<PersistInboundEmailResult> {
    assertInboundEmailHasTextBody(input.email);

    return this.db.transaction(async (tx) => {
      const database = tx as Database;
      const existingRecord = await findScopedInboundRecordByProviderMessage(
        database,
        input,
      );

      if (existingRecord) {
        return {
          customerId: existingRecord.customerId,
          conversationId: existingRecord.conversationId,
          activityId: existingRecord.activityId,
          alreadyProcessed: true,
        };
      }

      const createdAt = new Date();
      const customer = await findScopedCustomer(database, input);
      const customerId = customer?.id ?? createPrefixedId("cust");

      if (!customer) {
        await tx.insert(customers).values(
          buildInboundCustomerRow({
            scope: input.scope,
            email: input.email,
            customerId,
            createdAt,
          }),
        );
      } else {
        await tx
          .update(customers)
          .set({
            displayName: input.email.fromName ?? input.email.fromEmail,
            lastInteractionAt: input.email.receivedAt,
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

      const threadRecord = await findScopedConversationByProviderThread(
        database,
        input,
      );
      const conversationId =
        threadRecord?.conversationId ?? createPrefixedId("conv");

      if (!threadRecord) {
        await tx.insert(conversations).values(
          buildInboundConversationRow({
            scope: input.scope,
            conversationId,
            customerId,
            receivedAt: input.email.receivedAt,
          }),
        );
      } else {
        const existingConversation = await findScopedConversation(
          database,
          input,
          conversationId,
        );

        if (!existingConversation) {
          throw new ConflictError("Email thread conversation is missing.");
        }

        if (existingConversation.customerId !== customerId) {
          throw new ConflictError(
            "Email thread is already linked to another scoped customer.",
          );
        }

        await tx
          .update(conversations)
          .set({
            lastMessageAt: input.email.receivedAt,
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
      const inboundRecordId = createPrefixedId("email_inbound");

      await tx.insert(messages).values(
        buildInboundMessageRow({
          scope: input.scope,
          messageId,
          conversationId,
          email: input.email,
        }),
      );
      await tx.insert(activityEvents).values(
        buildInboundActivityRow({
          scope: input.scope,
          activityId,
          conversationId,
          email: input.email,
        }),
      );
      await tx.insert(emailInboundRecords).values(
        buildInboundRecordRow({
          scope: input.scope,
          id: inboundRecordId,
          conversationId,
          customerId,
          activityId,
          email: input.email,
          createdAt,
        }),
      );

      return {
        customerId,
        conversationId,
        activityId,
        alreadyProcessed: false,
      };
    });
  }
}
