import type { CustomerProfileRecord } from "./customer-repository";
import type {
  CustomerLifecycleStatusReadinessResult,
  CustomerLifecycleValue,
  CustomerStatusValue,
} from "./customer-lifecycle-status-readiness-types";

export function inferLifecycleStatus(customer: CustomerProfileRecord): {
  lifecycle: CustomerLifecycleValue;
  status: CustomerStatusValue;
  source: CustomerLifecycleStatusReadinessResult["currentState"]["source"];
} {
  if (customer.status === "active") {
    return {
      lifecycle: "active_customer",
      status: "engaged",
      source: "existing_customer_record",
    };
  }

  if (customer.status === "needs_follow_up") {
    return {
      lifecycle: "at_risk",
      status: "needs_follow_up",
      source: "existing_customer_record",
    };
  }

  if (customer.status === "new") {
    return {
      lifecycle: "lead",
      status: "new",
      source: "existing_customer_record",
    };
  }

  return {
    lifecycle: "unknown",
    status: "unknown",
    source: "unknown",
  };
}

export function recommendLifecycleStatusChange(
  current: ReturnType<typeof inferLifecycleStatus>,
) {
  if (current.status === "needs_follow_up") {
    return {
      recommendedLifecycle: "at_risk" as const,
      recommendedStatus: "needs_follow_up" as const,
      recommendedAction: "review_lifecycle_status" as const,
      reason:
        "Customer needs follow-up, so lifecycle/status should be reviewed.",
      requiredPermission: "customer:update",
    };
  }

  if (current.status === "engaged") {
    return {
      recommendedLifecycle: "no_change" as const,
      recommendedStatus: "no_change" as const,
      recommendedAction: "no_op" as const,
      reason: "Current lifecycle/status does not need a change.",
      requiredPermission: "customer:read",
    };
  }

  return {
    recommendedLifecycle: "unknown" as const,
    recommendedStatus: "unknown" as const,
    recommendedAction: "request_more_context" as const,
    reason: "More customer context is required before lifecycle/status review.",
    requiredPermission: "customer:read",
  };
}
