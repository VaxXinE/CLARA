# CLARA P17 Extension Snapshot AI Context Builder

P16 Extension-Assisted Channel Ingestion Hardening is complete.
P17 Real AI Analysis Activation is complete for controlled internal use.
P18 Controlled Internal Runtime Trial + Operational Readiness is current.
P17-PR-01 is complete.
P17-PR-02 is current.
P17-PR-02 builds AI-ready context but does not yet execute real AI provider calls.
P17-PR-03 is next: Real AI Analysis Output + Persistence + Dashboard Review UI.

## Contract

AI-ready context must come only from sanitized/redacted extension snapshots.
AuthContext and workspace membership remain source of truth.
Client-supplied workspaceId is not authoritative.
Extension-assisted ingestion remains internal/controlled/user-assisted.
Official WA/IG/TikTok APIs remain not activated.

The builder accepts only backend-scoped extension snapshots for WhatsApp,
Instagram, and TikTok. It rejects raw DOM, raw HTML, raw provider payloads, raw
webhook payloads, token-like fields, cookie-like fields, auth-header-like fields,
and secret-like fields before producing AI-ready context.

## Output

The AI-ready context is deterministic, bounded, structured, and marked with a
policy version. Customer text is untrusted input and must be separated from
system/developer instructions. Prompt-injection boundaries are required.

## Non-Goals

Raw prompts must not be persisted. Raw customer messages must not be persisted as
AI prompts. Raw AI provider payloads and responses must not be persisted.
Extension must not call AI providers directly. Outbound auto-send remains
disabled. Billing/payment remains deferred. CLARA is not public SaaS launch.
CLARA is not production deployment claim unless separately executed.
