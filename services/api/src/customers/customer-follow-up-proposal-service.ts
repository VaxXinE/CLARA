import { assertPermission } from "../auth/permissions";
import { NotFoundError } from "../errors/app-error";
import { getWorkspaceScopeFromAuth } from "../workspace/workspace-scope";
import type { CustomerRepository } from "./customer-repository";
import {
  toSafeFollowUpPayloadSummary,
  toSafeFollowUpText,
} from "./customer-follow-up-proposal-dto";
import {
  containsUnsafeFollowUpIntent,
  customerFollowUpProposalPolicyVersion,
  followUpIntentConfig,
} from "./customer-follow-up-proposal-policy";
import type {
  ReviewCustomerFollowUpProposalInput,
  ReviewCustomerFollowUpProposalResult,
} from "./customer-follow-up-proposal-types";

export class CustomerFollowUpProposalService {
  constructor(
    private readonly customers: CustomerRepository,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async reviewFollowUpProposal(
    input: ReviewCustomerFollowUpProposalInput,
  ): Promise<ReviewCustomerFollowUpProposalResult> {
    assertPermission(input.auth.role, "customer:read");

    const scope = getWorkspaceScopeFromAuth(input.auth);
    const customer = await this.customers.findByIdScoped(
      scope,
      input.customerId,
    );

    if (!customer) {
      throw new NotFoundError("Customer not found.");
    }

    const config = followUpIntentConfig[input.proposalIntent];
    const unsafeIntent =
      containsUnsafeFollowUpIntent(input.suggestedPayload) ||
      containsUnsafeFollowUpIntent(input.operatorInstruction);
    const instruction = toSafeFollowUpText(input.operatorInstruction);
    const payloadSummary = toSafeFollowUpPayloadSummary(input.suggestedPayload);
    const blockedReason = unsafeIntent
      ? "Follow-up proposal contains unsafe or non-reviewable content."
      : null;
    const reason = unsafeIntent
      ? "Unsafe content blocked before any follow-up workflow."
      : (instruction ?? "Review customer context before creating any task.");

    return {
      proposalId: `follow_up_proposal_${input.proposalIntent}_${customer.id}`,
      customerId: customer.id,
      workspaceId: scope.workspaceId,
      generatedAt: this.now().toISOString(),
      title: "Review task / follow-up workflow proposal",
      summary: [
        `Review-only follow-up proposal for ${customer.displayName}.`,
        instruction ? `Operator context: ${instruction}` : null,
        payloadSummary,
      ]
        .filter((value): value is string => value !== null)
        .join(" "),
      followUp: {
        intent: unsafeIntent ? "no_op" : input.proposalIntent,
        recommendedChannel: unsafeIntent
          ? "unknown"
          : config.recommendedChannel,
        urgency: unsafeIntent ? "high" : config.urgency,
        dueWindow: unsafeIntent ? "none" : config.dueWindow,
        reason,
      },
      proposedTask: {
        taskTitle: unsafeIntent
          ? "Blocked follow-up proposal"
          : config.taskTitle,
        taskDescription: unsafeIntent
          ? "No task was created because this proposal was blocked."
          : `Review whether a human-approved task should be created for ${customer.displayName}.`,
        executionStatus: "review_only",
        taskCreated: false,
        requiresHumanApproval: true,
        requiredPermission: config.requiredPermission,
      },
      risk: {
        level: unsafeIntent
          ? "critical"
          : config.urgency === "high"
            ? "high"
            : config.urgency === "medium"
              ? "medium"
              : "low",
        reasons: unsafeIntent
          ? [
              "Unsafe follow-up content requires rejection before any later flow.",
            ]
          : ["Proposal is review-only and needs explicit human approval."],
        blocked: unsafeIntent,
        blockedReason,
      },
      review: {
        reviewLabel: unsafeIntent
          ? "Blocked follow-up proposal"
          : "Ready for human review",
        nextStep: unsafeIntent
          ? "Reject this proposal and create a safer one."
          : "Review details before using a later approved task creation flow.",
        warnings: [
          "No task was created.",
          "No CRM mutation was executed.",
          "No outbound message was sent.",
        ],
      },
      safety: {
        readOnly: true,
        proposalOnly: true,
        taskCreated: false,
        mutationAllowed: false,
        actionExecuted: false,
        requiresHumanApprovalForMutation: true,
        policyVersion: customerFollowUpProposalPolicyVersion,
      },
    };
  }
}
