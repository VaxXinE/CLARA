import type { InferInsertModel } from "drizzle-orm";
import type { FixtureAppStore } from "../../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../../db/fixtures/fixture-store";
import {
  activityEvents,
  conversations,
  customers,
  messages,
  webchatInboundMessages,
} from "../../db/schema";
import { ConflictError, ValidationError } from "../../errors/app-error";
import { createPrefixedId } from "../email/email-inbound-repository";
import type {
  PersistWebchatInboundInput,
  PersistWebchatInboundResult,
} from "./webchat-inbound-types";

type CustomerInsert = InferInsertModel<typeof customers>;
type ConversationInsert = InferInsertModel<typeof conversations>;
type MessageInsert = InferInsertModel<typeof messages>;
type ActivityEventInsert = InferInsertModel<typeof activityEvents>;
type WebchatInboundInsert = InferInsertModel<typeof webchatInboundMessages>;

export interface WebchatInboundRepository {
  persistInboundMessage(
    input: PersistWebchatInboundInput,
  ): Promise<PersistWebchatInboundResult>;
}

function customerIdentity(input: PersistWebchatInboundInput): string {
  const message = input.message;

  if (message.customerEmail) {
    return message.customerEmail;
  }

  return `webchat:${input.channelAccountId}:${
    message.visitorId ?? message.sessionId ?? "anonymous"
  }`;
}

function customerDisplayName(input: PersistWebchatInboundInput): string {
  return (
    input.message.customerName ??
    input.message.customerEmail ??
    "Webchat visitor"
  );
}

function findCustomer(
  store: FixtureAppStore,
  input: PersistWebchatInboundInput,
): CustomerInsert | undefined {
  const identity = customerIdentity(input);

  return store.customers.find(
    (customer) =>
      customer.organizationId === input.scope.organizationId &&
      customer.workspaceId === input.scope.workspaceId &&
      customer.contactIdentifier === identity,
  );
}

function findConversationBySession(
  store: FixtureAppStore,
  input: PersistWebchatInboundInput,
): WebchatInboundInsert | undefined {
  if (!input.message.sessionId) {
    return undefined;
  }

  return store.webchatInboundMessages.find(
    (record) =>
      record.organizationId === input.scope.organizationId &&
      record.workspaceId === input.scope.workspaceId &&
      record.channelAccountId === input.channelAccountId &&
      record.sessionId === input.message.sessionId,
  );
}

export function assertValidWebchatMessage(
  input: PersistWebchatInboundInput,
): void {
  if (input.message.messageText.trim().length === 0) {
    throw new ValidationError("Webchat message text is required.");
  }
}

export class FixtureWebchatInboundRepository implements WebchatInboundRepository {
  private readonly store: FixtureAppStore;

  constructor(store: FixtureAppStore = createFixtureAppStore()) {
    this.store = store;
  }

  async persistInboundMessage(
    input: PersistWebchatInboundInput,
  ): Promise<PersistWebchatInboundResult> {
    assertValidWebchatMessage(input);

    const createdAt = new Date();
    const existingCustomer = findCustomer(this.store, input);
    const customerId = existingCustomer?.id ?? createPrefixedId("cust");

    if (!existingCustomer) {
      this.store.customers.push({
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
      existingCustomer.displayName = customerDisplayName(input);
      existingCustomer.lastInteractionAt = input.message.receivedAt;
      existingCustomer.updatedAt = createdAt;
    }

    const existingSession = findConversationBySession(this.store, input);
    const conversationId =
      existingSession?.conversationId ?? createPrefixedId("conv");
    const conversation = this.store.conversations.find(
      (item) =>
        item.id === conversationId &&
        item.organizationId === input.scope.organizationId &&
        item.workspaceId === input.scope.workspaceId,
    );

    if (conversation && conversation.customerId !== customerId) {
      throw new ConflictError(
        "Webchat session is already linked to another scoped customer.",
      );
    }

    if (!conversation) {
      this.store.conversations.push({
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
      conversation.lastMessageAt = input.message.receivedAt;
      conversation.updatedAt = createdAt;
    }

    const messageId = createPrefixedId("msg");
    const activityId = createPrefixedId("act");
    const webchatInboundId = createPrefixedId("webchat_inbound");

    this.store.messages.push({
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
    } satisfies MessageInsert);
    this.store.activityEvents.push({
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
    } satisfies ActivityEventInsert);
    this.store.webchatInboundMessages.push({
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
    } satisfies WebchatInboundInsert);

    return {
      customerId,
      conversationId,
      messageId,
      activityId,
      webchatInboundId,
    };
  }

  getState(): FixtureAppStore {
    return structuredClone(this.store);
  }
}
