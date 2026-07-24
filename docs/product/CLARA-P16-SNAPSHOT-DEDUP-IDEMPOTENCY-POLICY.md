# CLARA P16 Snapshot Dedup Idempotency Policy

P15 Controlled Internal Beta Execution is complete.
P16 Extension-Assisted Channel Ingestion Hardening is current.
P16-PR-01 is complete.
P16-PR-02 is complete.
P16-PR-03 is complete.
P16-PR-04 is current.
P16 closes only after this PR validates.

Deduplication and idempotency are required. Backend ingestion uses deterministic
snapshot hash plus workspace/channel/conversation-safe keys so repeated submits
do not create duplicate snapshots, conversations, messages, or materializations.

Conversation linking is workspace-scoped. Client-supplied workspaceId is not
authoritative. AuthContext and workspace membership remain source of truth.
Cross-workspace spoofing must be rejected.

Evidence/logs/docs/runbooks must not include secrets/tokens/cookies/auth
headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw
prompts/payment data.
