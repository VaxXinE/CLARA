import type {
  RateLimitQuotaUsageControl,
  RateLimitReadiness,
} from "./rate-limit-readiness-types";

export function getRateLimitReadinessPolicy(): RateLimitReadiness {
  return {
    policyDefined: true,
    perWorkspaceLimitDefined: true,
    perUserLimitDefined: true,
    perEndpointLimitDefined: true,
    burstLimitPolicyDefined: true,
    safe429BehaviorDefined: true,
    productionQuotaBlockingImplemented: false,
    destructiveThrottleImplemented: false,
  };
}

export function getRateLimitQuotaUsageControls(): RateLimitQuotaUsageControl[] {
  return [
    {
      controlKey: "rate_limit_readiness",
      label: "Rate Limit readiness",
      description:
        "Per-workspace, per-user, per-endpoint, burst, and safe 429 behavior are defined before scale launch.",
      status: "ready",
      severity: "warning",
      evidenceType: "policy",
    },
    {
      controlKey: "quota_readiness",
      label: "Quota readiness",
      description:
        "Soft limit, hard limit, and grace-period policies are readiness-only; no quota enforcement runs here.",
      status: "ready",
      severity: "critical",
      evidenceType: "runtime_guardrail",
    },
    {
      controlKey: "usage_metering_readiness",
      label: "Usage Metering readiness",
      description:
        "Usage summaries are aggregate-first and workspace-scoped with safe billing metadata only.",
      status: "ready",
      severity: "info",
      evidenceType: "test",
    },
    {
      controlKey: "billing_side_effect_boundary",
      label: "Billing side-effect boundary",
      description:
        "No payment provider integration, customer charging, invoice creation, subscription mutation, plan mutation, or entitlement mutation.",
      status: "ready",
      severity: "critical",
      evidenceType: "runtime_guardrail",
    },
    {
      controlKey: "dashboard_extension_boundary",
      label: "Dashboard and extension boundary",
      description:
        "Dashboard renders read-only readiness; extension cannot access quota, usage, or billing internals.",
      status: "planned",
      severity: "warning",
      evidenceType: "dashboard_boundary",
    },
  ];
}
