# CLARA P16 Cross-Workspace Spoofing Regression Policy

P15 Controlled Internal Beta Execution is complete.
P16 Extension-Assisted Channel Ingestion Hardening is current.
P16-PR-01 is complete.
P16-PR-02 is complete.
P16-PR-03 is current.

Cross-workspace spoofing must be rejected.
Client-supplied workspaceId is not authoritative.
AuthContext and workspace membership remain source of truth.
Snapshot attribution binds to authenticated operator and resolved workspace.

Regression tests must prove that extension snapshot intake rejects or ignores
client-provided organization/workspace scope and persists only under the
operator's resolved backend scope. Cross-workspace resource existence must not
be leaked.

Snapshot sanitization and redaction are required before storage and future AI analysis.
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
