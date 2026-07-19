import { assertPermission } from "../auth/permissions";
import { NotFoundError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import type { CustomerCrmActivityAuditService } from "./customer-crm-activity-audit-service";
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
    private readonly crmActivityAudits?: Pick<
      CustomerCrmActivityAuditService,
      "record"
    >,
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

    const result: CustomerOwnerAssignmentReadinessResult = {
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

    await this.crmActivityAudits?.record({
      auth: input.auth,
      eventType: unsafe
        ? "p8_crm_readiness_policy_blocked"
        : "p8_owner_assignment_readiness_viewed",
      customerId: customer.id,
      source: unsafe ? "policy" : "owner_assignment_readiness",
      outcome: unsafe ? "blocked" : "viewed",
      riskLevel: result.risk.level,
      policyVersion: customerOwnerAssignmentReadinessPolicyVersion,
      safeMetadata: {
        readinessLevel: result.readiness.level,
        recommendedAction: result.suggestedAssignment.recommendedAction,
        blockedReason: result.risk.blockedReason,
      },
    });

    return result;
  }
}
