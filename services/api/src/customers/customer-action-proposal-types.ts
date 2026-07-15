import type { AuthContext } from "../auth/auth-context";
import type {
  customerActionProposalSources,
  customerActionProposalTypes,
  proposalTypeConfig,
} from "./customer-action-proposal-policy";

export type CustomerActionProposalType =
  (typeof customerActionProposalTypes)[number];

export type CustomerActionProposalSource =
  (typeof customerActionProposalSources)[number];

export type CustomerActionKind =
  | (typeof proposalTypeConfig)[CustomerActionProposalType]["actionKind"]
  | "no_op";

export type CustomerActionProposalRiskLevel =
  "low" | "medium" | "high" | "critical";

export type GetCustomerActionProposalInput = {
  auth: AuthContext;
  customerId: string;
  proposalType: CustomerActionProposalType;
  source: CustomerActionProposalSource;
  operatorInstruction?: string;
  suggestedPayload?: Record<string, unknown>;
  clientWorkspaceId?: string;
};

export type GetCustomerActionProposalResult = {
  proposalId: string;
  customerId: string;
  workspaceId: string;
  generatedAt: string;
  proposalType: CustomerActionProposalType;
  title: string;
  summary: string;
  proposedAction: {
    actionKind: CustomerActionKind;
    executionStatus: "review_only";
    mutationExecuted: false;
    requiresHumanApproval: true;
    requiredPermission: string;
  };
  risk: {
    level: CustomerActionProposalRiskLevel;
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
    mutationAllowed: false;
    actionExecuted: false;
    requiresHumanApprovalForMutation: true;
    policyVersion: string;
  };
};
