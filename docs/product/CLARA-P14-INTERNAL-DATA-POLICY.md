# CLARA P14 Internal Data Policy

## Purpose

internal data policy exists to define what data may be used during the internal
beta rollout and what data remains prohibited.

## Allowed Data For Internal Beta

- Demo CRM customers and conversations.
- Internal test accounts created for CLARA validation.
- Safe aggregate analytics and readiness summaries.
- Workspace-scoped audit metadata with allowlisted fields only.
- Redacted support notes and known issue summaries.

## Prohibited Data

- Real secrets, API keys, OAuth tokens, refresh tokens, access tokens, private
  keys, passwords, payment credentials, or service role credentials.
- Raw provider payloads.
- Raw webhook payloads.
- Raw AI prompts containing sensitive customer content.
- Raw customer message exports unless separately approved.
- Production customer data before an explicit production data approval.

## Handling Rules

- Internal use first; do not invite public users in P14.
- Billing deferred; do not collect payment data.
- Public launch deferred; do not publish public onboarding docs as an active
  launch.
- Provider/AI/outbound activation remains controlled.
- Production deployment requires separate explicit action and data approval.
- Logs and docs must not include tokens, cookies, Authorization headers,
  provider raw payloads, or unredacted sensitive customer data.

## Retention / Cleanup

Internal beta data should be kept only as long as it supports QA, readiness
review, and issue triage. Demo data can be reset. Any production-like data use
requires a separate retention, backup, rollback, and privacy review.
