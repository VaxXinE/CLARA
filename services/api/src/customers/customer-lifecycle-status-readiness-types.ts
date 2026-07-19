import type { AuthContext } from "../auth/auth-context";
import type {
  customerLifecycleStatusReadinessLevels,
  customerLifecycleStatusRecommendedActions,
  customerLifecycleStatusRiskLevels,
  customerLifecycleValues,
  customerStatusValues,
} from "./customer-lifecycle-status-readiness-policy";

export type CustomerLifecycleValue = (typeof customerLifecycleValues)[number];
export type CustomerStatusValue = (typeof customerStatusValues)[number];
export type CustomerLifecycleStatusReadinessLevel =
  (typeof customerLifecycleStatusReadinessLevels)[number];
export type CustomerLifecycleStatusRecommendedAction =
  (typeof customerLifecycleStatusRecommendedActions)[number];
export type CustomerLifecycleStatusRiskLevel =
  (typeof customerLifecycleStatusRiskLevels)[number];

export type CustomerLifecycleStatusChangeValue =
  CustomerLifecycleValue | "no_change";

export type CustomerStatusChangeValue = CustomerStatusValue | "no_change";

export type GetCustomerLifecycleStatusReadinessInput = {
  auth: AuthContext;
  customerId: string;
  reviewContext?: Record<string, unknown>;
};

export type CustomerLifecycleStatusReadinessResult = {
  customerId: string;
  workspaceId: string;
  generatedAt: string;
  currentState: {
    lifecycle: CustomerLifecycleValue;
    status: CustomerStatusValue;
    source: "existing_customer_record" | "inferred_read_model" | "unknown";
  };
  readiness: {
    level: CustomerLifecycleStatusReadinessLevel;
    reasons: string[];
  };
  suggestedChange: {
    recommendedLifecycle: CustomerLifecycleStatusChangeValue;
    recommendedStatus: CustomerStatusChangeValue;
    recommendedAction: CustomerLifecycleStatusRecommendedAction;
    reason: string;
    executionStatus: "review_only";
    lifecycleUpdated: false;
    statusUpdated: false;
    requiresHumanApproval: true;
    requiredPermission: string;
  };
  transitionPolicy: {
    allowedForReview: boolean;
    blockedReason: string | null;
    warnings: string[];
  };
  risk: {
    level: CustomerLifecycleStatusRiskLevel;
    reasons: string[];
    blocked: boolean;
    blockedReason: string | null;
  };
  safety: {
    readOnly: true;
    proposalOnly: true;
    lifecycleUpdated: false;
    statusUpdated: false;
    mutationAllowed: false;
    actionExecuted: false;
    requiresHumanApprovalForMutation: true;
    policyVersion: string;
  };
};
