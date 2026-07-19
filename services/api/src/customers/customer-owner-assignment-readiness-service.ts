import { assertPermission } from "../auth/permissions";
import { NotFoundError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import { recommendOwnerRole } from "./customer-owner-assignment-readiness-dto";
import {
  containsUnsafeOwnerAssignmentInput,
  customerOwnerAssignmentReadinessPolicyVersion,
} from "./customer-owner-assignment-readiness-policy";
import type {
  CustomerOwnerAssignmentReadinessResult,
  GetCustomerOwnerAssignmentReadinessInput,
} from "./customer-owner-assignment-readiness-types";
import type { CustomerRepository } from "./customer-repository";

export class CustomerOwnerAssignmentReadinessService {
  constructor(
    private readonly customers: CustomerRepository,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async getReadiness(
    input: GetCustomerOwnerAssignmentReadinessInput,
  ): Promise<CustomerOwnerAssignmentReadinessResult> {
    assertPermission(input.auth.role, "customer:read");

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const customer = await this.customers.findByIdScoped(
      scope,
      input.customerId,
    );

    if (!customer) {
      throw new NotFoundError("Customer not found.");
    }

    const unsafe = containsUnsafeOwnerAssignmentInput(input.reviewContext);
    const recommendation = unsafe
      ? {
          recommendedRole: "unknown" as const,
          recommendedAction: "no_op" as const,
          reason: "Unsafe owner assignment readiness input was blocked.",
          requiredPermission: "customer:read",
        }
      : recommendOwnerRole(customer);

    return {
      customerId: customer.id,
      workspaceId: scope.workspaceId,
      generatedAt: this.now().toISOString(),
      readiness: {
        level: unsafe ? "blocked" : "ready_for_review",
        reasons: unsafe
          ? ["Unsafe input blocked before owner assignment review."]
          : ["Owner assignment readiness is review-only."],
      },
      currentOwnership: {
        hasOwner: false,
        ownerId: null,
        ownerRole: null,
        ownershipSource: "unknown",
      },
      suggestedAssignment: {
        ...recommendation,
        executionStatus: "review_only",
        ownerAssigned: false,
        requiresHumanApproval: true,
      },
      risk: {
        level: unsafe ? "critical" : "medium",
        reasons: unsafe
          ? ["Unsafe assignment request requires rejection."]
          : ["Future owner changes require explicit human approval."],
        blocked: unsafe,
        blockedReason: unsafe
          ? "Owner assignment readiness contains unsafe content."
          : null,
      },
      safety: {
        readOnly: true,
        proposalOnly: true,
        ownerAssigned: false,
        mutationAllowed: false,
        actionExecuted: false,
        requiresHumanApprovalForMutation: true,
        policyVersion: customerOwnerAssignmentReadinessPolicyVersion,
      },
    };
  }
}
