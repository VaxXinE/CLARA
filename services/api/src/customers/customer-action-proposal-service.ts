import { assertPermission } from "../auth/permissions";
import { NotFoundError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import type { CustomerCrmActivityAuditService } from "./customer-crm-activity-audit-service";
import type { CustomerRepository } from "./customer-repository";
import {
  toSafePayloadSummary,
  toSafeProposalText,
} from "./customer-action-proposal-dto";
import {
  containsUnsafeProposalIntent,
  customerActionProposalPolicyVersion,
  proposalTypeConfig,
} from "./customer-action-proposal-policy";
import type {
  GetCustomerActionProposalInput,
  GetCustomerActionProposalResult,
} from "./customer-action-proposal-types";

export class CustomerActionProposalService {
  constructor(
    private readonly customers: CustomerRepository,
    private readonly now: () => Date = () => new Date(),
    private readonly crmActivityAudits?: Pick<
      CustomerCrmActivityAuditService,
      "record"
    >,
  ) {}

  async reviewActionProposal(
    input: GetCustomerActionProposalInput,
  ): Promise<GetCustomerActionProposalResult> {
    assertPermission(input.auth.role, "customer:read");

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const customer = await this.customers.findByIdScoped(
      scope,
      input.customerId,
    );

    if (!customer) {
      throw new NotFoundError("Customer not found.");
    }

    const config = proposalTypeConfig[input.proposalType];
    const unsafeIntent =
      containsUnsafeProposalIntent(input.suggestedPayload) ||
      containsUnsafeProposalIntent(input.operatorInstruction);
    const generatedAt = this.now().toISOString();
    const instruction = toSafeProposalText(input.operatorInstruction);
    const blockedReason = unsafeIntent
      ? "Proposal contains unsafe or non-reviewable content."
      : null;

    const result: GetCustomerActionProposalResult = {
      proposalId: `crm_proposal_${input.proposalType}_${customer.id}`,
      customerId: customer.id,
      workspaceId: scope.workspaceId,
      generatedAt,
      proposalType: input.proposalType,
      title: config.title,
      summary: [
        `Review-only proposal for ${customer.displayName}.`,
        instruction ? `Operator context: ${instruction}` : null,
        toSafePayloadSummary(input.suggestedPayload),
      ]
        .filter((value): value is string => value !== null)
        .join(" "),
      proposedAction: {
        actionKind: unsafeIntent ? "no_op" : config.actionKind,
        executionStatus: "review_only",
        mutationExecuted: false,
        requiresHumanApproval: true,
        requiredPermission: config.requiredPermission,
      },
      risk: {
        level: unsafeIntent ? "critical" : config.riskLevel,
        reasons: unsafeIntent
          ? [
              "Unsafe proposal content requires rejection before any later flow.",
            ]
          : ["Proposal is review-only and needs explicit human approval."],
        blocked: unsafeIntent,
        blockedReason,
      },
      review: {
        reviewLabel: unsafeIntent
          ? "Blocked review proposal"
          : "Ready for human review",
        nextStep: unsafeIntent
          ? "Reject this proposal and create a safer one."
          : "Review details before using a later approved mutation flow.",
        warnings: [
          "No CRM mutation was executed.",
          "Future execution requires role permission, human approval, and audit.",
        ],
      },
      safety: {
        readOnly: true,
        proposalOnly: true,
        mutationAllowed: false,
        actionExecuted: false,
        requiresHumanApprovalForMutation: true,
        policyVersion: customerActionProposalPolicyVersion,
      },
    };

    await this.crmActivityAudits?.record({
      auth: input.auth,
      eventType: unsafeIntent
        ? "p8_crm_readiness_policy_blocked"
        : "p8_customer_action_proposal_reviewed",
      customerId: customer.id,
      source: unsafeIntent ? "policy" : "action_proposal",
      outcome: unsafeIntent ? "blocked" : "proposed",
      riskLevel: result.risk.level,
      policyVersion: customerActionProposalPolicyVersion,
      safeMetadata: {
        proposalType: result.proposalType,
        recommendedAction: result.proposedAction.actionKind,
        blockedReason: result.risk.blockedReason,
      },
    });

    return result;
  }
}
