import type { AuthContext } from "../auth/auth-context";
import type {
  customerFollowUpProposalIntents,
  customerFollowUpProposalSources,
  followUpIntentConfig,
} from "./customer-follow-up-proposal-policy";

export type CustomerFollowUpProposalSource =
  (typeof customerFollowUpProposalSources)[number];

export type CustomerFollowUpProposalIntent =
  (typeof customerFollowUpProposalIntents)[number];

export type CustomerFollowUpRecommendedChannel =
  (typeof followUpIntentConfig)[CustomerFollowUpProposalIntent]["recommendedChannel"];

export type CustomerFollowUpUrgency =
  (typeof followUpIntentConfig)[CustomerFollowUpProposalIntent]["urgency"];

export type CustomerFollowUpDueWindow =
  (typeof followUpIntentConfig)[CustomerFollowUpProposalIntent]["dueWindow"];

export type ReviewCustomerFollowUpProposalInput = {
  auth: AuthContext;
  customerId: string;
  source: CustomerFollowUpProposalSource;
  proposalIntent: CustomerFollowUpProposalIntent;
  operatorInstruction?: string;
  suggestedPayload?: Record<string, unknown>;
  clientWorkspaceId?: string;
};

export type ReviewCustomerFollowUpProposalResult = {
  proposalId: string;
  customerId: string;
  workspaceId: string;
  generatedAt: string;
  title: string;
  summary: string;
  followUp: {
    intent: CustomerFollowUpProposalIntent;
    recommendedChannel: CustomerFollowUpRecommendedChannel;
    urgency: CustomerFollowUpUrgency;
    dueWindow: CustomerFollowUpDueWindow;
    reason: string;
  };
  proposedTask: {
    taskTitle: string;
    taskDescription: string;
    executionStatus: "review_only";
    taskCreated: false;
    requiresHumanApproval: true;
    requiredPermission: string;
  };
  risk: {
    level: "low" | "medium" | "high" | "critical";
    reasons: string[];
    blocked: boolean;
    blockedReason: string | null;
  };
  review: {
    reviewLabel: string;
    nextStep: string;
    warnings: string[];
  };
  safety: {
    readOnly: true;
    proposalOnly: true;
    taskCreated: false;
    mutationAllowed: false;
    actionExecuted: false;
    requiresHumanApprovalForMutation: true;
    policyVersion: string;
  };
};
