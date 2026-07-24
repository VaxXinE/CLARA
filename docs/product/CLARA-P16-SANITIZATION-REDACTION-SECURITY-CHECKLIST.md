# CLARA P16 Sanitization Redaction Security Checklist

P15 Controlled Internal Beta Execution is complete.
P16 Extension-Assisted Channel Ingestion Hardening is current.
P16-PR-01 is complete.
P16-PR-02 is complete.
P16-PR-03 is current.

Use this checklist before any extension snapshot ingestion demo or internal
runtime smoke:

- Snapshot sanitization and redaction are required before storage and future AI analysis.
- Client-supplied workspaceId is not authoritative.
- AuthContext and workspace membership remain source of truth.
- Snapshot attribution binds to authenticated operator and resolved workspace.
- Cross-workspace spoofing must be rejected.
- Snapshots must not include secrets/tokens/cookies/auth headers/API keys/localStorage/sessionStorage secrets/raw DOM/raw HTML/full page dumps/raw prompts/raw provider payloads/raw webhook payloads/payment data.
- Snapshot evidence must minimize customer-sensitive data.
- Extension-assisted ingestion is not official WA/IG/TikTok API activation.
- Official WA/IG/TikTok APIs remain not activated.
- Extension-assisted ingestion is not public SaaS launch.
- Extension-assisted ingestion is not production deployment claim unless separately executed.
- Billing/payment remains deferred.
- Real AI provider calls remain not activated in this PR.
- Provider/AI/outbound activation remains controlled.
- No outbound auto-send is activated.

Validation wording: p16 snapshot sanitization and redaction gate, workspace attribution gate, and evidence privacy gate.
