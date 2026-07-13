import type { InferInsertModel } from "drizzle-orm";
import type { FixtureAppStore } from "../../db/fixtures/fixture-store";
import { createFixtureAppStore } from "../../db/fixtures/fixture-store";
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

type CustomerInsert = InferInsertModel<typeof customers>;
type WhatsappInboundInsert = InferInsertModel<typeof whatsappInboundMessages>;

export interface WhatsappInboundRepository {
  persistInboundMessage(
    input: PersistWhatsappInboundInput,
  ): Promise<PersistWhatsappInboundResult>;
}

function customerIdentity(input: PersistWhatsappInboundInput): string {
  return `whatsapp:${input.channelAccountId}:${input.message.senderExternalId}`;
}

function customerDisplayName(input: PersistWhatsappInboundInput): string {
  return input.message.senderDisplayName ?? input.message.senderExternalId;
}

function findExisting(
  store: FixtureAppStore,
  input: PersistWhatsappInboundInput,
): WhatsappInboundInsert | undefined {
  return store.whatsappInboundMessages.find(
    (record) =>
      record.organizationId === input.scope.organizationId &&
      record.workspaceId === input.scope.workspaceId &&
      record.externalMessageId === input.message.externalMessageId,
  );
}

function findCustomer(
  store: FixtureAppStore,
  input: PersistWhatsappInboundInput,
): CustomerInsert | undefined {
  const identity = customerIdentity(input);

  return store.customers.find(
    (customer) =>
      customer.organizationId === input.scope.organizationId &&
      customer.workspaceId === input.scope.workspaceId &&
      customer.contactIdentifier === identity,
  );
}

export class FixtureWhatsappInboundRepository implements WhatsappInboundRepository {
  private readonly store: FixtureAppStore;

  constructor(store: FixtureAppStore = createFixtureAppStore()) {
    this.store = store;
  }

  async persistInboundMessage(
    input: PersistWhatsappInboundInput,
  ): Promise<PersistWhatsappInboundResult> {
    const existing = findExisting(this.store, input);

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
    const customer = findCustomer(this.store, input);
    const customerId = customer?.id ?? createPrefixedId("cust");

    if (!customer) {
      this.store.customers.push({
        id: customerId,
        organizationId: input.scope.organizationId,
        workspaceId: input.scope.workspaceId,
        displayName: customerDisplayName(input),
        contactIdentifier: customerIdentity(input),
        source: "whatsapp",
        status: "active",
        notesSummary: null,
        lastInteractionAt: input.message.receivedAt,
        createdAt,
        updatedAt: createdAt,
      });
    } else {
      customer.displayName = customerDisplayName(input);
      customer.lastInteractionAt = input.message.receivedAt;
      customer.updatedAt = createdAt;
    }

    const conversationId = createPrefixedId("conv");
    const messageId = createPrefixedId("msg");
    const activityId = createPrefixedId("act");
    const whatsappInboundId = createPrefixedId("whatsapp_inbound");

    this.store.conversations.push({
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
    });
    this.store.activityEvents.push({
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
    this.store.whatsappInboundMessages.push({
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
  }

  getState(): FixtureAppStore {
    return structuredClone(this.store);
  }
}
