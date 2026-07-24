# CLARA P16 Snapshot Sanitization Pipeline

P15 Controlled Internal Beta Execution is complete.
P16 Extension-Assisted Channel Ingestion Hardening is current.
P16-PR-01 is complete.
P16-PR-02 is complete.
P16-PR-03 is current.

Snapshot sanitization and redaction are required before storage and future AI analysis.
The pipeline accepts only the allowlisted extension snapshot contract: provider
`extension`, `official_api=false`, channel, captured timestamp, snapshot hash,
safe chat title/subtitle, safe origin, and bounded visible message fields.

Client-supplied workspaceId is not authoritative.
AuthContext and workspace membership remain source of truth.
Snapshot attribution binds to authenticated operator and resolved workspace.
Cross-workspace spoofing must be rejected.

Snapshots must not include secrets/tokens/cookies/auth headers/API keys/localStorage/sessionStorage secrets/raw DOM/raw HTML/full page dumps/raw prompts/raw provider payloads/raw webhook payloads/payment data.
Snapshot evidence must minimize customer-sensitive data.

Extension-assisted ingestion is not official WA/IG/TikTok API activation.
Official WA/IG/TikTok APIs remain not activated.
Extension-assisted ingestion is not public SaaS launch.
Extension-assisted ingestion is not production deployment claim unless separately executed.
Billing/payment remains deferred.
Real AI provider calls remain not activated in this PR.
Provider/AI/outbound activation remains controlled.
No outbound auto-send is activated.

Validation wording: snapshot sanitization and redaction are required before storage and future AI analysis; client-supplied workspaceId is not authoritative; billing/payment is deferred.
