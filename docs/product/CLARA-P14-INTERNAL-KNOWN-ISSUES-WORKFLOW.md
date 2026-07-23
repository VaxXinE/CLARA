# CLARA P14 Internal Known Issues Workflow

## Status

P14-PR-05 is current. Known issues workflow is internal beta only.

## Workflow

1. Triage feedback manually.
2. Reject unsafe evidence before storing the issue.
3. Create or update a repo-safe known issue entry.
4. Link severity, priority, affected role, affected workflow, and next action.
5. Review blockers before adding more internal users.

## Guardrails

Feedback triage is manual/local/repo-safe unless separately approved. Feedback
must not include secrets/tokens/cookies/auth headers/raw provider payload/raw
webhook payload/raw HTML/raw DOM/raw prompts/payment data. Feedback should
minimize customer-sensitive data.

billing/payment is deferred. public SaaS launch is deferred. production
deployment requires separate explicit action. provider/AI/outbound activation
remains controlled. no external support tool integration is activated.
