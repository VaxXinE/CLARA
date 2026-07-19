import { assertPermission } from "../auth/permissions";
import type { ConversationListItemRecord } from "../conversations/conversation-repository";
import { NotFoundError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import type { WorkspaceScope } from "../workspace/workspace-scope";
import type { CustomerCrmActivityAuditService } from "./customer-crm-activity-audit-service";
import type { CustomerRepository } from "./customer-repository";
import {
  customerProfileIntelligencePolicyVersion,
  isOpenConversationStatus,
} from "./customer-intelligence-policy";
import {
  type GetCustomerProfileIntelligenceInput,
  type GetCustomerProfileIntelligenceResult,
} from "./customer-intelligence-types";

const recentWindowMs = 14 * 24 * 60 * 60 * 1000;
const staleWindowMs = 30 * 24 * 60 * 60 * 1000;

export type CustomerIntelligenceConversationRepository = {
  listByCustomerScoped(
    scope: WorkspaceScope,
    customerId: string,
  ): Promise<ConversationListItemRecord[]>;
};

function maxDate(dates: Array<Date | null>): Date | null {
  const timestamps = dates
    .filter((date): date is Date => date !== null)
    .map((date) => date.getTime());

  if (timestamps.length === 0) {
    return null;
  }

  return new Date(Math.max(...timestamps));
}

export class CustomerProfileIntelligenceService {
  constructor(
    private readonly customers: CustomerRepository,
    private readonly conversations: CustomerIntelligenceConversationRepository,
    private readonly now: () => Date = () => new Date(),
    private readonly crmActivityAudits?: Pick<
      CustomerCrmActivityAuditService,
      "record"
    >,
  ) {}

  async getCustomerProfileIntelligence(
    input: GetCustomerProfileIntelligenceInput,
  ): Promise<GetCustomerProfileIntelligenceResult> {
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
    const generatedAt = this.now();
    const lastConversationAt =
      maxDate(
        conversations.map((conversation) => conversation.lastMessageAt),
      ) ?? customer.lastInteractionAt;
    const openConversationCount = conversations.filter((conversation) =>
      isOpenConversationStatus(conversation.status),
    ).length;
    const recentActivityCount = conversations.filter((conversation) => {
      const activityDate = conversation.lastMessageAt ?? conversation.updatedAt;

      return generatedAt.getTime() - activityDate.getTime() <= recentWindowMs;
    }).length;
    const profileReasons: string[] = [];

    if (!customer.contactIdentifier) {
      profileReasons.push("Customer contact identifier is missing.");
    }

    if (!customer.notesSummary) {
      profileReasons.push("Customer notes summary is missing.");
    }

    if (openConversationCount > 0) {
      profileReasons.push("Customer has open conversations to review.");
    }

    const profileHealthLevel =
      profileReasons.length === 0
        ? "healthy"
        : !customer.contactIdentifier || !customer.notesSummary
          ? "incomplete"
          : "needs_attention";
    const hasRecentInteraction =
      lastConversationAt !== null &&
      generatedAt.getTime() - lastConversationAt.getTime() <= staleWindowMs;
    const hasAnyConversation = conversations.length > 0;
    const lifecycleSuggestion = !hasAnyConversation
      ? "lead"
      : hasRecentInteraction
        ? "active_customer"
        : "at_risk";
    const statusSuggestion = !hasAnyConversation
      ? "new"
      : openConversationCount > 0
        ? "needs_follow_up"
        : hasRecentInteraction
          ? "engaged"
          : "dormant";
    const recommendedAction =
      openConversationCount > 0
        ? "follow_up"
        : profileHealthLevel === "incomplete"
          ? "update_profile_review"
          : lifecycleSuggestion === "at_risk"
            ? "review_customer"
            : "none";

    const result: GetCustomerProfileIntelligenceResult = {
      customerId: customer.id,
      workspaceId: scope.workspaceId,
      generatedAt: generatedAt.toISOString(),
      profileHealth: {
        level: profileHealthLevel,
        reasons:
          profileReasons.length > 0
            ? profileReasons
            : ["Customer profile has enough safe read-only data."],
      },
      activitySignals: {
        lastConversationAt: lastConversationAt?.toISOString() ?? null,
        lastReplyAt: null,
        openConversationCount,
        totalConversationCount: conversations.length,
        recentActivityCount,
      },
      relationshipSignals: {
        lifecycleSuggestion,
        lifecycleReason: hasRecentInteraction
          ? "Recent workspace-scoped conversation activity exists."
          : "No recent workspace-scoped conversation activity was found.",
        statusSuggestion,
        statusReason:
          openConversationCount > 0
            ? "Open conversations require human review."
            : "Status suggestion is based on safe read-only conversation recency.",
      },
      followUpSignals: {
        recommendedAction,
        urgency: openConversationCount > 0 ? "high" : "low",
        reason:
          recommendedAction === "none"
            ? "No immediate follow-up signal was found."
            : "Recommended action is review-only and must be approved by a human.",
      },
      safety: {
        readOnly: true,
        mutationAllowed: false,
        requiresHumanApprovalForMutation: true,
        policyVersion: customerProfileIntelligencePolicyVersion,
      },
    };

    await this.crmActivityAudits?.record({
      auth: input.auth,
      eventType: "p8_customer_profile_intelligence_viewed",
      customerId: customer.id,
      source: "customer_profile_intelligence",
      outcome: "viewed",
      riskLevel: result.profileHealth.level === "healthy" ? "low" : "medium",
      policyVersion: customerProfileIntelligencePolicyVersion,
      safeMetadata: {
        readinessLevel: result.profileHealth.level,
        recommendedAction: result.followUpSignals.recommendedAction,
      },
    });

    return result;
  }
}
