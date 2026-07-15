import { assertPermission } from "../auth/permissions";
import type {
  ConversationDetailRecord,
  ConversationListItemRecord,
} from "../conversations/conversation-repository";
import { NotFoundError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type { CustomerRepository } from "./customer-repository";
import {
  sortTimelineEvents,
  toSafeTimelineMetadata,
} from "./customer-timeline-intelligence-dto";
import {
  customerTimelineIntelligencePolicyVersion,
  toTimelineSeverity,
} from "./customer-timeline-intelligence-policy";
import type {
  CustomerTimelineEvent,
  GetCustomerTimelineIntelligenceInput,
  GetCustomerTimelineIntelligenceResult,
} from "./customer-timeline-intelligence-types";

const maxConversationDetails = 10;
const maxEvents = 30;

export type CustomerTimelineConversationRepository = {
  listByCustomerScoped(
    scope: WorkspaceScope,
    customerId: string,
  ): Promise<ConversationListItemRecord[]>;
  findByIdScoped(
    scope: WorkspaceScope,
    conversationId: string,
  ): Promise<ConversationDetailRecord | null>;
};

function summarizeSnippet(value: string | null): string {
  if (!value) {
    return "No message preview is available.";
  }

  return value.length > 140 ? `${value.slice(0, 137)}...` : value;
}

function conversationEvent(
  conversation: ConversationListItemRecord,
  kind: "started" | "updated",
): CustomerTimelineEvent {
  const isStarted = kind === "started";

  return {
    id: `conversation_${kind}_${conversation.id}`,
    occurredAt: (isStarted
      ? conversation.createdAt
      : (conversation.lastMessageAt ?? conversation.updatedAt)
    ).toISOString(),
    type: isStarted ? "conversation_started" : "conversation_updated",
    source: "conversation",
    title: isStarted ? "Conversation started" : "Conversation updated",
    summary: summarizeSnippet(conversation.snippet),
    channel: conversation.source,
    conversationId: conversation.id,
    severity: toTimelineSeverity(conversation.status),
    safeMetadata: toSafeTimelineMetadata({
      status: conversation.status,
      channel: conversation.source,
      assigned_user_id: conversation.assignedUser?.id ?? null,
    }),
  };
}

function messageEvents(
  conversation: ConversationDetailRecord,
): CustomerTimelineEvent[] {
  return conversation.messages.slice(-6).map((message) => {
    const outbound = message.direction === "outbound";

    return {
      id: `message_${message.id}`,
      occurredAt: message.sentAt.toISOString(),
      type: outbound ? "outbound_reply" : "inbound_message",
      source: outbound ? "reply" : "conversation",
      title: outbound ? "Outbound reply recorded" : "Inbound message received",
      summary: summarizeSnippet(message.body),
      channel: conversation.source,
      conversationId: conversation.id,
      ...(outbound ? { replyId: message.id } : {}),
      severity: outbound ? "success" : "info",
      safeMetadata: toSafeTimelineMetadata({
        delivery_status: message.deliveryStatus,
        sender_type: message.senderType,
      }),
    };
  });
}

export class CustomerTimelineIntelligenceService {
  constructor(
    private readonly customers: CustomerRepository,
    private readonly conversations: CustomerTimelineConversationRepository,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async getCustomerTimelineIntelligence(
    input: GetCustomerTimelineIntelligenceInput,
  ): Promise<GetCustomerTimelineIntelligenceResult> {
    assertPermission(input.auth.role, "customer:read");

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const customer = await this.customers.findByIdScoped(
      scope,
      input.customerId,
    );

    if (!customer) {
      throw new NotFoundError("Customer not found.");
    }

    const conversations = await this.conversations.listByCustomerScoped(
      scope,
      input.customerId,
    );
    const details = await Promise.all(
      conversations
        .slice(0, maxConversationDetails)
        .map((conversation) =>
          this.conversations.findByIdScoped(scope, conversation.id),
        ),
    );
    const openConversations = conversations.filter((conversation) =>
      ["open", "pending", "needs_follow_up"].includes(conversation.status),
    );
    const events = sortTimelineEvents([
      {
        id: `customer_created_${customer.id}`,
        occurredAt: customer.createdAt.toISOString(),
        type: "customer_created",
        source: "customer",
        title: "Customer profile created",
        summary: `${customer.displayName} entered this workspace.`,
        channel: customer.source,
        severity: "info",
        safeMetadata: toSafeTimelineMetadata({
          customer_status: customer.status,
          source: customer.source,
        }),
      },
      {
        id: `customer_profile_signal_${customer.id}`,
        occurredAt: customer.updatedAt.toISOString(),
        type: "customer_profile_signal",
        source: "customer",
        title: "Customer profile signal",
        summary: customer.notesSummary
          ? "Customer profile contains a safe notes summary."
          : "Customer profile still needs human review for missing notes.",
        channel: customer.source,
        severity: customer.notesSummary ? "success" : "attention",
        safeMetadata: toSafeTimelineMetadata({
          has_contact_identifier: Boolean(customer.contactIdentifier),
          has_notes_summary: Boolean(customer.notesSummary),
        }),
      },
      ...conversations.flatMap((conversation) => [
        conversationEvent(conversation, "started"),
        conversationEvent(conversation, "updated"),
      ]),
      ...details.flatMap((detail) => (detail ? messageEvents(detail) : [])),
    ]).slice(0, maxEvents);

    return {
      customerId: customer.id,
      workspaceId: scope.workspaceId,
      generatedAt: this.now().toISOString(),
      timeline: {
        events,
      },
      intelligence: {
        keyMoments:
          conversations.length > 0
            ? [
                `${conversations.length} workspace-scoped conversation(s) found.`,
                `Latest timeline event: ${events[0]?.title ?? "none"}.`,
              ]
            : ["No conversation timeline exists yet."],
        recentSignals: [
          `${openConversations.length} open conversation(s) need review.`,
          customer.lastInteractionAt
            ? `Last known interaction: ${customer.lastInteractionAt.toISOString()}.`
            : "No last interaction timestamp is available.",
        ],
        riskFlags:
          openConversations.length > 0
            ? ["Open conversations require human follow-up review."]
            : [],
        followUpHints:
          openConversations.length > 0
            ? ["Review open conversations before proposing any CRM action."]
            : ["No immediate follow-up signal was found."],
      },
      safety: {
        readOnly: true,
        mutationAllowed: false,
        requiresHumanApprovalForMutation: true,
        policyVersion: customerTimelineIntelligencePolicyVersion,
      },
    };
  }
}
