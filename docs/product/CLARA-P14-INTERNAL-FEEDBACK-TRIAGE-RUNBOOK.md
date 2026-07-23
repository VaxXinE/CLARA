# CLARA P14 Internal Feedback Triage Runbook

## Status

P14-PR-01 is complete. P14-PR-02 is complete. P14-PR-03 is complete.
P14-PR-04 is complete. P14-PR-05 is complete. P14-PR-06 is current.

## Triage Flow

1. Receive internal feedback through the agreed manual channel.
2. Remove or reject unsafe content before it enters the repo.
3. Classify the report as bug, usability issue, data issue, access issue, or
   CRM workflow gap.
4. Assign severity and priority using the P14 severity policy.
5. Link the known issue if it already exists; otherwise add a repo-safe known
   issue entry.
6. Route product gaps to roadmap review, not emergency runtime changes.

## Safety Rules

Feedback triage is manual/local/repo-safe unless separately approved. Feedback
must not include secrets/tokens/cookies/auth headers/raw provider payload/raw
webhook payload/raw HTML/raw DOM/raw prompts/payment data. Feedback should
minimize customer-sensitive data.

no external support tool integration is activated. Do not send notification
webhooks, email, Slack, Discord, push notifications, support tickets, background
jobs, or queue jobs from this workflow.
