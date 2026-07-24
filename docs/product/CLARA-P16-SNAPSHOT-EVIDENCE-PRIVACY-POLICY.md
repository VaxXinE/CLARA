# CLARA P16 Snapshot Evidence Privacy Policy

P15 Controlled Internal Beta Execution is complete.
P16 Extension-Assisted Channel Ingestion Hardening is current.
P16-PR-01 is complete.
P16-PR-02 is complete.
P16-PR-03 is current.

Snapshot evidence must minimize customer-sensitive data.
Snapshot sanitization and redaction are required before storage and future AI analysis.

Evidence may include safe identifiers, channel, counts, status, snapshot hash,
conversation id, customer id, timestamps, correlation id, authenticated
operator id, and resolved workspace id. Evidence must not include raw customer
message bodies, raw platform payloads, browser secrets, provider credentials,
payment data, or future AI prompt material.

Snapshots must not include secrets/tokens/cookies/auth headers/API keys/localStorage/sessionStorage secrets/raw DOM/raw HTML/full page dumps/raw prompts/raw provider payloads/raw webhook payloads/payment data.
Client-supplied workspaceId is not authoritative.
AuthContext and workspace membership remain source of truth.
Snapshot attribution binds to authenticated operator and resolved workspace.
Cross-workspace spoofing must be rejected.

Extension-assisted ingestion is not official WA/IG/TikTok API activation.
Official WA/IG/TikTok APIs remain not activated.
Extension-assisted ingestion is not public SaaS launch.
Extension-assisted ingestion is not production deployment claim unless separately executed.
Billing/payment remains deferred.
Real AI provider calls remain not activated in this PR.
Provider/AI/outbound activation remains controlled.
No outbound auto-send is activated.
