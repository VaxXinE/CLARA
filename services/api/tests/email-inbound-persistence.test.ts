import { describe, expect, it } from "vitest";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";
import { FixtureConversationRepository } from "../src/conversations/conversation-repository";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { FixtureActivityRepository } from "../src/activity/activity-repository";
import { EmailInboundPersistenceService } from "../src/channels/email/email-inbound-persistence-service";
import { FixtureEmailInboundRepository } from "../src/channels/email/email-inbound-repository";

const scope = {
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
} as const;

function createService() {
  const store = createFixtureAppStore();

  return {
    store,
    repository: new FixtureEmailInboundRepository(store),
    service: new EmailInboundPersistenceService(
      new FixtureEmailInboundRepository(store),
    ),
    conversations: new FixtureConversationRepository(store),
    customers: new FixtureCustomerRepository(store),
    activity: new FixtureActivityRepository(store),
  };
}

describe("email inbound persistence service", () => {
  it("creates scoped customer, conversation, message, activity, and idempotency record", async () => {
    const { service, repository, conversations, customers, activity } =
      createService();

    const result = await service.persistInboundEmail({
      scope,
      email: {
        provider: "simulated-email",
        providerMessageId: "email_msg_001",
        threadId: "email_thread_001",
        fromEmail: "inbound.customer@example.test",
        fromName: "Inbound Customer",
        toEmail: "support@example.test",
        subject: "Need help with product setup",
        textBody: "Hello team,\nPlease help with setup.",
        htmlBodyPresent: true,
        receivedAt: new Date("2026-07-09T06:00:00.000Z"),
        headers: {
          "message-id": "<email_msg_001@example.test>",
        },
        attachmentsPresent: true,
      },
    });

    expect(result.alreadyProcessed).toBe(false);

    const state = repository.getState();
    const createdCustomer = state.customers.find(
      (customer) => customer.id === result.customerId,
    );
    const createdConversation = state.conversations.find(
      (conversation) => conversation.id === result.conversationId,
    );
    const createdActivity = state.activityEvents.find(
      (event) => event.id === result.activityId,
    );

    expect(createdCustomer).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      contactIdentifier: "inbound.customer@example.test",
      displayName: "Inbound Customer",
      source: "email",
    });
    expect(createdConversation).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      customerId: result.customerId,
      source: "email",
      status: "open",
    });
    expect(
      state.messages.find(
        (message) => message.conversationId === result.conversationId,
      ),
    ).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      direction: "inbound",
      senderType: "customer",
      body: "Hello team,\nPlease help with setup.",
      deliveryStatus: "received",
    });
    expect(createdActivity).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      conversationId: result.conversationId,
      eventType: "email_received",
      summary: "Inbound email received.",
    });
    expect(JSON.stringify(createdActivity?.metadata ?? {})).not.toContain(
      "Hello team",
    );

    const conversationDetail = await conversations.findByIdScoped(
      scope,
      result.conversationId,
    );
    const customerDetail = await customers.findByIdScoped(
      scope,
      result.customerId,
    );
    const activityItems = await activity.listByConversationScoped(
      scope,
      result.conversationId,
    );

    expect(conversationDetail?.messages.at(-1)?.body).toBe(
      "Hello team,\nPlease help with setup.",
    );
    expect(customerDetail?.contactIdentifier).toBe(
      "inbound.customer@example.test",
    );
    expect(activityItems[0]?.eventType).toBe("email_received");
  });

  it("returns already_processed=true and does not duplicate rows for the same provider message id", async () => {
    const { service, repository } = createService();
    const email = {
      provider: "simulated-email",
      providerMessageId: "email_msg_duplicate",
      threadId: "email_thread_duplicate",
      fromEmail: "duplicate@example.test",
      fromName: "Duplicate Customer",
      toEmail: "support@example.test",
      subject: "Duplicate message",
      textBody: "Please process me once.",
      htmlBodyPresent: false,
      receivedAt: new Date("2026-07-09T07:00:00.000Z"),
      headers: {},
      attachmentsPresent: false,
    } as const;

    const first = await service.persistInboundEmail({ scope, email });
    const beforeDuplicateState = repository.getState();
    const second = await service.persistInboundEmail({ scope, email });
    const afterDuplicateState = repository.getState();

    expect(first.alreadyProcessed).toBe(false);
    expect(second).toEqual({
      customerId: first.customerId,
      conversationId: first.conversationId,
      activityId: first.activityId,
      alreadyProcessed: true,
    });
    expect(afterDuplicateState.customers).toHaveLength(
      beforeDuplicateState.customers.length,
    );
    expect(afterDuplicateState.conversations).toHaveLength(
      beforeDuplicateState.conversations.length,
    );
    expect(afterDuplicateState.messages).toHaveLength(
      beforeDuplicateState.messages.length,
    );
    expect(afterDuplicateState.activityEvents).toHaveLength(
      beforeDuplicateState.activityEvents.length,
    );
  });

  it("reuses the same scoped customer and conversation for a later message in the same provider thread", async () => {
    const { service } = createService();

    const first = await service.persistInboundEmail({
      scope,
      email: {
        provider: "simulated-email",
        providerMessageId: "email_msg_thread_001",
        threadId: "email_thread_reuse",
        fromEmail: "thread.customer@example.test",
        fromName: "Thread Customer",
        toEmail: "support@example.test",
        subject: "First thread email",
        textBody: "First message body.",
        htmlBodyPresent: false,
        receivedAt: new Date("2026-07-09T08:00:00.000Z"),
        headers: {},
        attachmentsPresent: false,
      },
    });

    const second = await service.persistInboundEmail({
      scope,
      email: {
        provider: "simulated-email",
        providerMessageId: "email_msg_thread_002",
        threadId: "email_thread_reuse",
        fromEmail: "thread.customer@example.test",
        fromName: "Thread Customer",
        toEmail: "support@example.test",
        subject: "Second thread email",
        textBody: "Second message body.",
        htmlBodyPresent: false,
        receivedAt: new Date("2026-07-09T08:05:00.000Z"),
        headers: {},
        attachmentsPresent: false,
      },
    });

    expect(second.alreadyProcessed).toBe(false);
    expect(second.customerId).toBe(first.customerId);
    expect(second.conversationId).toBe(first.conversationId);
    expect(second.activityId).not.toBe(first.activityId);
  });

  it("rejects html-only inbound email because raw html is not persisted", async () => {
    const { service } = createService();

    await expect(
      service.persistInboundEmail({
        scope,
        email: {
          provider: "simulated-email",
          providerMessageId: "email_msg_html_only",
          threadId: null,
          fromEmail: "html-only@example.test",
          fromName: "HTML Only",
          toEmail: "support@example.test",
          subject: "HTML only",
          textBody: "   ",
          htmlBodyPresent: true,
          receivedAt: new Date("2026-07-09T09:00:00.000Z"),
          headers: {},
          attachmentsPresent: false,
        },
      }),
    ).rejects.toThrow(
      "Inbound email must include a non-empty plain text body.",
    );
  });

  it("does not reuse another workspace customer or conversation", async () => {
    const { service, repository } = createService();

    const result = await service.persistInboundEmail({
      scope: {
        organizationId: "org_demo_other",
        workspaceId: "wks_demo_other",
      },
      email: {
        provider: "simulated-email",
        providerMessageId: "email_msg_other_workspace",
        threadId: "email_thread_other_workspace",
        fromEmail: "sari@example.test",
        fromName: "Same Email Different Workspace",
        toEmail: "support@example.test",
        subject: "Isolation check",
        textBody: "This must stay in the other workspace.",
        htmlBodyPresent: false,
        receivedAt: new Date("2026-07-09T10:00:00.000Z"),
        headers: {},
        attachmentsPresent: false,
      },
    });

    const createdCustomer = repository
      .getState()
      .customers.find((customer) => customer.id === result.customerId);

    expect(createdCustomer).toMatchObject({
      organizationId: "org_demo_other",
      workspaceId: "wks_demo_other",
      contactIdentifier: "sari@example.test",
    });
    expect(result.customerId).not.toBe("cust_demo_sari");
  });
});
