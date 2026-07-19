import { assertPermission } from "../auth/permissions";
import { NotFoundError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import type { CustomerCrmActivityAuditService } from "./customer-crm-activity-audit-service";
import {
  inferLifecycleStatus,
  recommendLifecycleStatusChange,
} from "./customer-lifecycle-status-readiness-dto";
import {
  containsUnsafeLifecycleStatusInput,
  customerLifecycleStatusReadinessPolicyVersion,
} from "./customer-lifecycle-status-readiness-policy";
import type {
  CustomerLifecycleStatusReadinessResult,
  GetCustomerLifecycleStatusReadinessInput,
} from "./customer-lifecycle-status-readiness-types";
import type { CustomerRepository } from "./customer-repository";

export class CustomerLifecycleStatusReadinessService {
  constructor(
    private readonly customers: CustomerRepository,
    private readonly now: () => Date = () => new Date(),
    private readonly crmActivityAudits?: Pick<
      CustomerCrmActivityAuditService,
      "record"
    >,
  ) {}

  async getReadiness(
    input: GetCustomerLifecycleStatusReadinessInput,
  ): Promise<CustomerLifecycleStatusReadinessResult> {
    assertPermission(input.auth.role, "customer:read");

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const customer = await this.customers.findByIdScoped(
      scope,
      input.customerId,
    );

    if (!customer) {
      throw new NotFoundError("Customer not found.");
    }

    const currentState = inferLifecycleStatus(customer);
    const unsafe = containsUnsafeLifecycleStatusInput(input.reviewContext);
    const recommendation = unsafe
      ? {
          recommendedLifecycle: "unknown" as const,
          recommendedStatus: "unknown" as const,
          recommendedAction: "no_op" as const,
          reason: "Unsafe lifecycle/status readiness input was blocked.",
          requiredPermission: "customer:read",
        }
      : recommendLifecycleStatusChange(currentState);
    const noChange = recommendation.recommendedAction === "no_op";

    const result: CustomerLifecycleStatusReadinessResult = {
      customerId: customer.id,
      workspaceId: scope.workspaceId,
      generatedAt: this.now().toISOString(),
      currentState,
      readiness: {
        level: unsafe
          ? "blocked"
          : noChange
            ? "no_change_recommended"
            : "ready_for_review",
        reasons: unsafe
          ? ["Unsafe input blocked before lifecycle/status review."]
          : noChange
            ? ["No lifecycle/status change is recommended."]
            : ["Lifecycle/status readiness is review-only."],
      },
      suggestedChange: {
        ...recommendation,
        executionStatus: "review_only",
        lifecycleUpdated: false,
        statusUpdated: false,
        requiresHumanApproval: true,
      },
      transitionPolicy: {
        allowedForReview: !unsafe,
        blockedReason: unsafe
          ? "Lifecycle/status readiness contains unsafe content."
          : null,
        warnings: [
          "No lifecycle was updated.",
          "No customer status was updated.",
          "Human approval is required before any future change.",
        ],
      },
      risk: {
        level: unsafe ? "critical" : noChange ? "low" : "medium",
        reasons: unsafe
          ? ["Unsafe lifecycle/status request requires rejection."]
          : [
              "Future lifecycle/status changes require explicit human approval.",
            ],
        blocked: unsafe,
        blockedReason: unsafe
          ? "Lifecycle/status readiness contains unsafe content."
          : null,
      },
      safety: {
        readOnly: true,
        proposalOnly: true,
        lifecycleUpdated: false,
        statusUpdated: false,
        mutationAllowed: false,
        actionExecuted: false,
        requiresHumanApprovalForMutation: true,
        policyVersion: customerLifecycleStatusReadinessPolicyVersion,
      },
    };

    await this.crmActivityAudits?.record({
      auth: input.auth,
      eventType: unsafe
        ? "p8_crm_readiness_policy_blocked"
        : "p8_lifecycle_status_readiness_viewed",
      customerId: customer.id,
      source: unsafe ? "policy" : "lifecycle_status_readiness",
      outcome: unsafe ? "blocked" : "viewed",
      riskLevel: result.risk.level,
      policyVersion: customerLifecycleStatusReadinessPolicyVersion,
      safeMetadata: {
        readinessLevel: result.readiness.level,
        recommendedAction: result.suggestedChange.recommendedAction,
        blockedReason: result.risk.blockedReason,
      },
    });

    return result;
  }
}
