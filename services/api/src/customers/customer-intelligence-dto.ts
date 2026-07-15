export type CustomerProfileHealthLevel =
  "healthy" | "needs_attention" | "incomplete" | "unknown";

export type CustomerLifecycleSuggestion =
  "lead" | "active_customer" | "at_risk" | "inactive" | "unknown";

export type CustomerStatusSuggestion =
  "new" | "engaged" | "needs_follow_up" | "dormant" | "unknown";

export type CustomerFollowUpAction =
  | "none"
  | "review_customer"
  | "follow_up"
  | "update_profile_review"
  | "assign_owner_review";

export type CustomerFollowUpUrgency = "low" | "medium" | "high";

export type CustomerProfileIntelligenceDto = {
  customerId: string;
  workspaceId: string;
  generatedAt: string;
  profileHealth: {
    level: CustomerProfileHealthLevel;
    reasons: string[];
  };
  activitySignals: {
    lastConversationAt: string | null;
    lastReplyAt: string | null;
    openConversationCount: number;
    totalConversationCount: number;
    recentActivityCount: number;
  };
  relationshipSignals: {
    lifecycleSuggestion: CustomerLifecycleSuggestion;
    lifecycleReason: string;
    statusSuggestion: CustomerStatusSuggestion;
    statusReason: string;
  };
  followUpSignals: {
    recommendedAction: CustomerFollowUpAction;
    urgency: CustomerFollowUpUrgency;
    reason: string;
  };
  safety: {
    readOnly: true;
    mutationAllowed: false;
    requiresHumanApprovalForMutation: true;
    policyVersion: string;
  };
};
