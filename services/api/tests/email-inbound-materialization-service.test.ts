import { describe, expect, it } from "vitest";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";
import { EmailInboundMaterializationService } from "../src/channels/email/email-inbound-materialization-service";
import { EmailInboundPersistenceService } from "../src/channels/email/email-inbound-persistence-service";
import { FixtureEmailInboundRepository } from "../src/channels/email/email-inbound-repository";

const scope = {
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
} as const;

function createService() {
  const store = createFixtureAppStore();
  const repository = new FixtureEmailInboundRepository(store);

  return {
    repository,
    service: new EmailInboundMaterializationService(
      new EmailInboundPersistenceService(repository),
    ),
    conversations: new FixtureConversationRepository(store),
    customers: new FixtureCustomerRepository(store),
  };
}

describe("EmailInboundMaterializationService", () => {
  it("creates scoped customer and conversation from a Gmail envelope safely", async () => {
    const { service, repository, customers, conversations } = createService();

    const result = await service.materialize({
      scope,
      envelope: {
        provider: "gmail",
        provider_account_id: "gmail_account_demo",
        provider_message_id: "gmail_msg_001",
        provider_thread_id: "gmail_thread_001",
        message_id: "<gmail_msg_001@example.test>",
        in_reply_to: null,
        references: null,
        snippet: "Safe preview",
        label_ids: ["INBOX"],
        cc: [],
        bcc: [],
        email: {
          provider: "gmail",
          providerMessageId: "gmail_msg_001",
          threadId: "gmail_thread_001",
          fromEmail: "gmail.customer@example.test",
          fromName: "Gmail Customer",
          toEmail: "support@example.test",
          subject: "Need help",
          textBody: "Safe preview",
          htmlBodyPresent: false,
          receivedAt: new Date("2026-07-10T13:00:00.000Z"),
          headers: {
            "message-id": "<gmail_msg_001@example.test>",
          },
          attachmentsPresent: false,
        },
      },
    });

    expect(result.alreadyProcessed).toBe(false);

    const state = repository.getState();
    expect(
      state.customers.find((customer) => customer.id === result.customerId),
    ).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      contactIdentifier: "gmail.customer@example.test",
    });
    expect(
      state.conversations.find(
        (conversation) => conversation.id === result.conversationId,
      ),
    ).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      customerId: result.customerId,
      source: "email",
    });
    expect(JSON.stringify(state)).not.toContain("gmail_account_demo");
    expect(JSON.stringify(state)).not.toContain("access_token");
    expect(JSON.stringify(state)).not.toContain("refresh_token");

    const customer = await customers.findByIdScoped(scope, result.customerId);
    const conversation = await conversations.findByIdScoped(
      scope,
      result.conversationId,
    );

    expect(customer?.contactIdentifier).toBe("gmail.customer@example.test");
    expect(conversation?.messages.at(-1)?.body).toBe("Safe preview");
  });

  it("is idempotent for the same provider message and reuses scoped thread conversation", async () => {
    const { service } = createService();

    const first = await service.materialize({
      scope,
      envelope: {
        provider: "gmail",
        provider_account_id: "gmail_account_demo",
        provider_message_id: "gmail_msg_dup_001",
        provider_thread_id: "gmail_thread_reuse",
        message_id: "<gmail_msg_dup_001@example.test>",
        in_reply_to: null,
        references: null,
        snippet: "First preview",
        label_ids: ["INBOX"],
        cc: [],
        bcc: [],
        email: {
          provider: "gmail",
          providerMessageId: "gmail_msg_dup_001",
          threadId: "gmail_thread_reuse",
          fromEmail: "reuse@example.test",
          fromName: "Reuse Customer",
          toEmail: "support@example.test",
          subject: "First",
          textBody: "First preview",
          htmlBodyPresent: false,
          receivedAt: new Date("2026-07-10T13:05:00.000Z"),
          headers: {},
          attachmentsPresent: false,
        },
      },
    });

    const duplicate = await service.materialize({
      scope,
      envelope: {
        provider: "gmail",
        provider_account_id: "gmail_account_demo",
        provider_message_id: "gmail_msg_dup_001",
        provider_thread_id: "gmail_thread_reuse",
        message_id: "<gmail_msg_dup_001@example.test>",
        in_reply_to: null,
        references: null,
        snippet: "First preview",
        label_ids: ["INBOX"],
        cc: [],
        bcc: [],
        email: {
          provider: "gmail",
          providerMessageId: "gmail_msg_dup_001",
          threadId: "gmail_thread_reuse",
          fromEmail: "reuse@example.test",
          fromName: "Reuse Customer",
          toEmail: "support@example.test",
          subject: "First",
          textBody: "First preview",
          htmlBodyPresent: false,
          receivedAt: new Date("2026-07-10T13:05:00.000Z"),
          headers: {},
          attachmentsPresent: false,
        },
      },
    });

    const second = await service.materialize({
      scope,
      envelope: {
        provider: "gmail",
        provider_account_id: "gmail_account_demo",
        provider_message_id: "gmail_msg_dup_002",
        provider_thread_id: "gmail_thread_reuse",
        message_id: "<gmail_msg_dup_002@example.test>",
        in_reply_to: "<gmail_msg_dup_001@example.test>",
        references: "<gmail_msg_dup_001@example.test>",
        snippet: "Second preview",
        label_ids: ["INBOX"],
        cc: [],
        bcc: [],
        email: {
          provider: "gmail",
          providerMessageId: "gmail_msg_dup_002",
          threadId: "gmail_thread_reuse",
          fromEmail: "reuse@example.test",
          fromName: "Reuse Customer",
          toEmail: "support@example.test",
          subject: "Second",
          textBody: "Second preview",
          htmlBodyPresent: false,
          receivedAt: new Date("2026-07-10T13:06:00.000Z"),
          headers: {
            "in-reply-to": "<gmail_msg_dup_001@example.test>",
            references: "<gmail_msg_dup_001@example.test>",
          },
          attachmentsPresent: false,
        },
      },
    });

    expect(duplicate).toEqual({
      customerId: first.customerId,
      conversationId: first.conversationId,
      activityId: first.activityId,
      alreadyProcessed: true,
    });
    expect(second.alreadyProcessed).toBe(false);
    expect(second.customerId).toBe(first.customerId);
    expect(second.conversationId).toBe(first.conversationId);
  });
});
