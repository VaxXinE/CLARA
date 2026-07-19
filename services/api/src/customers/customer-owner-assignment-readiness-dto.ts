import type { CustomerProfileRecord } from "./customer-repository";

export function recommendOwnerRole(customer: CustomerProfileRecord) {
  if (customer.status === "needs_follow_up") {
    return {
      recommendedRole: "sales" as const,
      recommendedAction: "assign_owner_review" as const,
      reason: "Customer needs follow-up, so a sales owner should review.",
      requiredPermission: "customer:assign_owner",
    };
  }

  if (customer.status === "active") {
    return {
      recommendedRole: "support" as const,
      recommendedAction: "review_assignment" as const,
      reason: "Active customer should have a support owner reviewed.",
      requiredPermission: "customer:assign_owner",
    };
  }

  return {
    recommendedRole: "admin_review" as const,
    recommendedAction: "request_more_context" as const,
    reason: "Customer ownership needs more context before review.",
    requiredPermission: "customer:read",
  };
}
