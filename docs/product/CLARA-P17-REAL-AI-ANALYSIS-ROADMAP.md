# CLARA P17 Real AI Analysis Roadmap

P16 Extension-Assisted Channel Ingestion Hardening is complete.
P16-PR-04 is complete.
P17 Real AI Analysis Activation is current.
P17-PR-01 is complete.
P17-PR-02 is complete.
P17-PR-03 is complete.
P17-PR-04 is current/final validation gate.
P17 is considered complete only after P17-PR-04 validates and merges.

P17-PR-01 prepares AI provider runtime configuration.
P17-PR-02 builds AI-ready context but does not execute real AI provider calls.
P17-PR-03 activates controlled backend real AI analysis for extension-assisted AI-ready context.

## Roadmap

- P17-PR-01 AI Provider Runtime Config + Secret Boundary + Cost Guardrail.
- P17-PR-02 Extension Snapshot AI Context Builder + PII Redaction (complete).
- P17-PR-03 Real AI Analysis Output + Persistence + Dashboard Review UI (complete).
- P17-PR-04 Final Extension-Assisted AI Runtime QA + Security Runbook (current/final validation gate).

## Guardrails

AI provider secrets are server-only.
AI provider secrets must not be exposed to dashboard or extension.
AI provider secrets must not be logged, persisted, audited, or returned in API responses.
AI provider config fails closed by default.
AI provider mode defaults to disabled.
AI model allowlist is required.
AI cost guardrails are required.
AI rate limit and abuse guardrails are required.
AI timeout policy is required.
AI audit redaction is required.
AI-ready context must come only from sanitized/redacted extension snapshots.
PII redaction is required before future AI provider calls.
Customer text is untrusted input and must be separated from system/developer instructions.
Prompt-injection boundaries are required.
AI context size budgets are required.
Real AI analysis is server-only.
Real AI analysis uses only sanitized/redacted AI-ready context.
Real AI analysis fails closed when provider config is missing/invalid/disabled.
Model allowlist, cost guardrail, rate limit guardrail, timeout policy, and prompt-injection boundary are enforced.
AI analysis persistence stores only safe/redacted result.
Dashboard review UI shows only safe AI analysis output.

Raw prompts, raw customer messages, raw provider payloads, raw provider
responses, tokens, cookies, auth headers, raw DOM, raw HTML, raw webhook
payloads, and payment data must not be logged or stored.
Raw customer messages must not be persisted as AI prompts.
Raw AI provider payloads and responses must not be persisted.

Extension-assisted ingestion remains internal/controlled/user-assisted.
Official WA/IG/TikTok APIs remain not activated.
Outbound auto-send remains disabled.
Billing/payment remains deferred.
CLARA is not public SaaS launch.
CLARA is not production deployment claim unless separately executed.
AuthContext and workspace membership remain source of truth.
Client-supplied workspaceId is not authoritative.
