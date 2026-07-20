import type { AuthContext } from "../auth/auth-context";

export type RateLimitQuotaUsageStatus = "ready" | "planned" | "blocked";
export type RateLimitQuotaUsageSeverity = "info" | "warning" | "critical";
export type RateLimitQuotaUsageEvidenceType =
  | "policy"
  | "test"
  | "runbook"
  | "runtime_guardrail"
  | "dashboard_boundary"
  | "extension_boundary";

export type RateLimitQuotaUsageControl = {
  controlKey: string;
  label: string;
  description: string;
  status: RateLimitQuotaUsageStatus;
  severity: RateLimitQuotaUsageSeverity;
  evidenceType: RateLimitQuotaUsageEvidenceType;
};

export type RateLimitQuotaUsageReadinessInput = {
  auth: AuthContext;
  generatedAt?: Date;
};

export type RateLimitReadiness = {
  policyDefined: true;
  perWorkspaceLimitDefined: true;
  perUserLimitDefined: true;
  perEndpointLimitDefined: true;
  burstLimitPolicyDefined: true;
  safe429BehaviorDefined: true;
  productionQuotaBlockingImplemented: false;
  destructiveThrottleImplemented: false;
};
