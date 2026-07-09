import { randomUUID } from "node:crypto";
import type { InferInsertModel } from "drizzle-orm";
import type { FixtureAppStore } from "../../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../../db/fixtures/fixture-store";
import {
  activityEvents,
  conversations,
  customers,
  emailInboundRecords,
  messages,
} from "../../db/schema";
import { ConflictError, ValidationError } from "../../errors/app-error";
import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type { NormalizedInboundEmailMessage } from "./email-channel-types";

type CustomerInsert = InferInsertModel<typeof customers>;
type ConversationInsert = InferInsertModel<typeof conversations>;
type MessageInsert = InferInsertModel<typeof messages>;
type ActivityEventInsert = InferInsertModel<typeof activityEvents>;
type EmailInboundRecordInsert = InferInsertModel<typeof emailInboundRecords>;

export type PersistInboundEmailInput = {
  scope: WorkspaceScope;
  email: NormalizedInboundEmailMessage;
};

export type PersistInboundEmailResult = {
  customerId: string;
  conversationId: string;
  activityId: string;
  alreadyProcessed: boolean;
};

export interface EmailInboundRepository {
  persistInboundEmail(
    input: PersistInboundEmailInput,
  ): Promise<PersistInboundEmailResult>;
}

export function createPrefixedId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

export function assertInboundEmailHasTextBody(
  email: NormalizedInboundEmailMessage,
): void {
  if (email.textBody.trim().length === 0) {
    throw new ValidationError(
      "Inbound email must include a non-empty plain text body.",
    );
  }
}

export function buildInboundCustomerRow(input: {
  scope: WorkspaceScope;
  email: NormalizedInboundEmailMessage;
  customerId: string;
  createdAt: Date;
}): CustomerInsert {
  return {
    id: input.customerId,
    organizationId: input.scope.organizationId,
    workspaceId: input.scope.workspaceId,
    displayName: input.email.fromName ?? input.email.fromEmail,
    contactIdentifier: input.email.fromEmail,
    source: "email",
    status: "active",
    notesSummary: null,
    lastInteractionAt: input.email.receivedAt,
    createdAt: input.createdAt,
    updatedAt: input.createdAt,
  };
}

export function buildInboundConversationRow(input: {
  scope: WorkspaceScope;
  conversationId: string;
  customerId: string;
  receivedAt: Date;
}): ConversationInsert {
  return {
    id: input.conversationId,
    organizationId: input.scope.organizationId,
    workspaceId: input.scope.workspaceId,
    customerId: input.customerId,
    source: "email",
    status: "open",
    assignedUserId: null,
    lastMessageAt: input.receivedAt,
    createdAt: input.receivedAt,
    updatedAt: input.receivedAt,
  };
}

export function buildInboundMessageRow(input: {
  scope: WorkspaceScope;
  messageId: string;
  conversationId: string;
  email: NormalizedInboundEmailMessage;
}): MessageInsert {
  return {
    id: input.messageId,
    organizationId: input.scope.organizationId,
    workspaceId: input.scope.workspaceId,
    conversationId: input.conversationId,
    direction: "inbound",
    senderType: "customer",
    senderUserId: null,
    body: input.email.textBody,
    sentAt: input.email.receivedAt,
    deliveryStatus: "received",
    createdAt: input.email.receivedAt,
  };
}

export function buildInboundActivityRow(input: {
  scope: WorkspaceScope;
  activityId: string;
  conversationId: string;
  email: NormalizedInboundEmailMessage;
}): ActivityEventInsert {
  return {
    id: input.activityId,
    organizationId: input.scope.organizationId,
    workspaceId: input.scope.workspaceId,
    conversationId: input.conversationId,
    actorUserId: null,
    eventType: "email_received",
    summary: "Inbound email received.",
    metadata: {
      channel: "email",
      provider: input.email.provider,
      provider_message_id: input.email.providerMessageId,
      provider_thread_id: input.email.threadId,
      from_email: input.email.fromEmail,
      subject: input.email.subject,
      html_body_present: input.email.htmlBodyPresent,
      attachments_present: input.email.attachmentsPresent,
      headers: input.email.headers,
    },
    createdAt: input.email.receivedAt,
  };
}

export function buildInboundRecordRow(input: {
  scope: WorkspaceScope;
  id: string;
  conversationId: string;
  customerId: string;
  activityId: string;
  email: NormalizedInboundEmailMessage;
  createdAt: Date;
}): EmailInboundRecordInsert {
  return {
    id: input.id,
    organizationId: input.scope.organizationId,
    workspaceId: input.scope.workspaceId,
    provider: input.email.provider,
    providerMessageId: input.email.providerMessageId,
    providerThreadId: input.email.threadId,
    customerId: input.customerId,
    conversationId: input.conversationId,
    activityId: input.activityId,
    receivedAt: input.email.receivedAt,
    createdAt: input.createdAt,
  };
}

function findScopedCustomer(
  store: FixtureAppStore,
  input: PersistInboundEmailInput,
): CustomerInsert | undefined {
  return store.customers.find(
    (customer) =>
      customer.organizationId === input.scope.organizationId &&
      customer.workspaceId === input.scope.workspaceId &&
      customer.contactIdentifier?.toLowerCase() === input.email.fromEmail,
  );
}

function findScopedInboundRecordByProviderMessage(
  store: FixtureAppStore,
  input: PersistInboundEmailInput,
): EmailInboundRecordInsert | undefined {
  return store.emailInboundRecords.find(
    (record) =>
      record.organizationId === input.scope.organizationId &&
      record.workspaceId === input.scope.workspaceId &&
      record.provider === input.email.provider &&
      record.providerMessageId === input.email.providerMessageId,
  );
}

function findScopedInboundRecordByProviderThread(
  store: FixtureAppStore,
  input: PersistInboundEmailInput,
): EmailInboundRecordInsert | undefined {
  if (!input.email.threadId) {
    return undefined;
  }

  return store.emailInboundRecords.find(
    (record) =>
      record.organizationId === input.scope.organizationId &&
      record.workspaceId === input.scope.workspaceId &&
      record.provider === input.email.provider &&
      record.providerThreadId === input.email.threadId,
  );
}

function findScopedConversation(
  store: FixtureAppStore,
  scope: WorkspaceScope,
  conversationId: string,
): ConversationInsert | undefined {
  return store.conversations.find(
    (conversation) =>
      conversation.id === conversationId &&
      conversation.organizationId === scope.organizationId &&
      conversation.workspaceId === scope.workspaceId,
  );
}

export class FixtureEmailInboundRepository implements EmailInboundRepository {
  private readonly store: FixtureAppStore;

  constructor(store: FixtureAppStore = createFixtureAppStore()) {
    this.store = store;
  }

  async persistInboundEmail(
    input: PersistInboundEmailInput,
  ): Promise<PersistInboundEmailResult> {
    assertInboundEmailHasTextBody(input.email);

    const existingRecord = findScopedInboundRecordByProviderMessage(
      this.store,
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
    const existingCustomer = findScopedCustomer(this.store, input);
    const customerId = existingCustomer?.id ?? createPrefixedId("cust");

    if (!existingCustomer) {
      this.store.customers.push(
        buildInboundCustomerRow({
          scope: input.scope,
          email: input.email,
          customerId,
          createdAt,
        }),
      );
    } else {
      existingCustomer.displayName =
        input.email.fromName ?? existingCustomer.displayName;
      existingCustomer.lastInteractionAt = input.email.receivedAt;
      existingCustomer.updatedAt = createdAt;
    }

    const existingThreadRecord = findScopedInboundRecordByProviderThread(
      this.store,
      input,
    );
    const conversationId =
      existingThreadRecord?.conversationId ?? createPrefixedId("conv");
    const conversation = existingThreadRecord
      ? findScopedConversation(this.store, input.scope, conversationId)
      : undefined;

    if (conversation && conversation.customerId !== customerId) {
      throw new ConflictError(
        "Email thread is already linked to another scoped customer.",
      );
    }

    if (!conversation) {
      this.store.conversations.push(
        buildInboundConversationRow({
          scope: input.scope,
          conversationId,
          customerId,
          receivedAt: input.email.receivedAt,
        }),
      );
    } else {
      conversation.lastMessageAt = input.email.receivedAt;
      conversation.updatedAt = createdAt;
    }

    const messageId = createPrefixedId("msg");
    const activityId = createPrefixedId("act");
    const inboundRecordId = createPrefixedId("email_inbound");

    this.store.messages.push(
      buildInboundMessageRow({
        scope: input.scope,
        messageId,
        conversationId,
        email: input.email,
      }),
    );
    this.store.activityEvents.push(
      buildInboundActivityRow({
        scope: input.scope,
        activityId,
        conversationId,
        email: input.email,
      }),
    );
    this.store.emailInboundRecords.push(
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
  }

  getState(): FixtureAppStore {
    return structuredClone(this.store);
  }
}
