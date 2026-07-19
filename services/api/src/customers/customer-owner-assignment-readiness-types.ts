import type { AuthContext } from "../auth/auth-context";
import type {
  ownerAssignmentReadinessLevels,
  ownerAssignmentRecommendedActions,
  ownerAssignmentRecommendedRoles,
  ownerAssignmentRiskLevels,
} from "./customer-owner-assignment-readiness-policy";

export type OwnerAssignmentReadinessLevel =
  (typeof ownerAssignmentReadinessLevels)[number];

export type OwnerAssignmentRecommendedRole =
  (typeof ownerAssignmentRecommendedRoles)[number];

export type OwnerAssignmentRecommendedAction =
  (typeof ownerAssignmentRecommendedActions)[number];

export type OwnerAssignmentRiskLevel =
  (typeof ownerAssignmentRiskLevels)[number];

export type GetCustomerOwnerAssignmentReadinessInput = {
  auth: AuthContext;
  customerId: string;
  reviewContext?: Record<string, unknown>;
};

export type CustomerOwnerAssignmentReadinessResult = {
  customerId: string;
  workspaceId: string;
  generatedAt: string;
  readiness: {
    level: OwnerAssignmentReadinessLevel;
    reasons: string[];
  };
  currentOwnership: {
    hasOwner: boolean;
    ownerId: string | null;
    ownerRole: string | null;
    ownershipSource: "existing_customer_record" | "unknown";
  };
  suggestedAssignment: {
    recommendedRole: OwnerAssignmentRecommendedRole;
    recommendedAction: OwnerAssignmentRecommendedAction;
    reason: string;
    executionStatus: "review_only";
    ownerAssigned: false;
    requiresHumanApproval: true;
    requiredPermission: string;
  };
  risk: {
    level: OwnerAssignmentRiskLevel;
    reasons: string[];
    blocked: boolean;
    blockedReason: string | null;
  };
  safety: {
    readOnly: true;
    proposalOnly: true;
    ownerAssigned: false;
    mutationAllowed: false;
    actionExecuted: false;
    requiresHumanApprovalForMutation: true;
    policyVersion: string;
  };
};
