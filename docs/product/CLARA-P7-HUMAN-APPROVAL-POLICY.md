---
project: "CLARA"
artifact: "P7 Human Approval Policy"
status: "implemented"
owner: "CLARA Engineering, Security, and Product"
classification: "approval-policy"
---

# CLARA P7 Human Approval Policy

## Suggestion Versus Action

AI suggestions are suggestions only. A human operator must explicitly approve any customer-visible or operational action.

## Reply Send Approval

Reply send requires explicit operator click. AI cannot auto-send, schedule-send, or bypass composer review.

## Follow-Up And Task Approval

Follow-up tasks and next actions require operator approval until a future approved automation policy exists.

## Blocked Mutations

AI cannot change role/user/workspace/billing/provider settings. AI cannot connect or disconnect providers. Policy blocks must use safeReasonCode such as `ai_policy_blocked` or `ai_human_approval_required`.
