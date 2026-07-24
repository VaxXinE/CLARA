# CLARA P16 Backend Ingestion Contract

P15 Controlled Internal Beta Execution is complete.
P16 Extension-Assisted Channel Ingestion Hardening is current.
P16-PR-01 is complete.
P16-PR-02 is complete.
P16-PR-03 is complete.
P16-PR-04 is current.
P16 closes only after this PR validates.

Backend ingestion accepts only sanitized/redacted extension snapshots from the
authenticated extension bridge route. The accepted contract is limited to:
provider, official_api=false, channel, captured_at, snapshot_hash, chat title,
optional subtitle/origin, and visible active-chat messages.

Client-supplied workspaceId is not authoritative. AuthContext and workspace
membership remain source of truth. Cross-workspace spoofing must be rejected.

Extension-assisted ingestion is not official WA/IG/TikTok API activation.
Official WA/IG/TikTok APIs remain not activated. Extension-assisted ingestion
is not public SaaS launch. Extension-assisted ingestion is not production
deployment claim unless separately executed. Billing/payment is deferred. Real
AI provider calls remain not activated in this PR. Provider/AI/outbound
activation remains controlled. No outbound auto-send is activated.
