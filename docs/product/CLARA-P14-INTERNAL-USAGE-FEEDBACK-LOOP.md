# CLARA P14 Internal Usage Feedback Loop

## Status

P14-PR-01 is complete. P14-PR-02 is complete. P14-PR-03 is complete.
P14-PR-04 is complete. P14-PR-05 is complete. P14-PR-06 is current.

Internal usage feedback loop is for internal beta rollout. Feedback triage is
manual/local/repo-safe unless separately approved.

## Feedback Scope

Internal beta users may report:

- Bugs that block CRM workflow validation.
- Usability issues in dashboard or extension workflows.
- Data quality issues in internal seed/import data.
- Access issues tied to role, workspace membership, or AuthContext behavior.
- CRM workflow gaps that should be considered after internal beta.

## Privacy Boundary

Feedback must not include secrets/tokens/cookies/auth headers/raw provider
payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data.
Feedback should minimize customer-sensitive data.

Use short reproduction steps, safe IDs, role names, screen names, and redacted
examples. Do not paste raw customer transcripts or provider payloads.

## Activation Boundary

Known issues workflow is internal beta only. billing/payment is deferred.
public SaaS launch is deferred. production deployment requires separate
explicit action. provider/AI/outbound activation remains controlled. no
external support tool integration is activated.

This feedback loop is manual documentation and repository workflow only. It
does not send email, Slack, Discord, webhook, push notification, or support tool
notifications.
