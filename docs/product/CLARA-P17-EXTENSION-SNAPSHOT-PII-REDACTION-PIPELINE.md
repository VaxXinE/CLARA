# CLARA P17 Extension Snapshot PII Redaction Pipeline

P17-PR-02 is current.
PII redaction is required before future AI provider calls.
AI-ready context must come only from sanitized/redacted extension snapshots.

## Redaction Scope

The redaction pipeline masks phone numbers, emails, bearer values, access-token
style values, API-key style values, auth-header-like values, cookies,
payment-like values, and URLs that carry secret-like query parameters.

Customer text is untrusted input and must be separated from system/developer
instructions. Redaction is applied before the AI context builder returns
AI-ready context.

## Privacy Rules

Raw prompts must not be persisted. Raw customer messages must not be persisted as
AI prompts. Raw AI provider payloads and responses must not be persisted. AI
provider secrets are server-only. AI provider secrets must not be exposed to
dashboard or extension.
