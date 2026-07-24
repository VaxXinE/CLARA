# CLARA P16 Customer Linking Readiness Policy

P15 Controlled Internal Beta Execution is complete.
P16 Extension-Assisted Channel Ingestion Hardening is current.
P16-PR-01 is complete.
P16-PR-02 is complete.
P16-PR-03 is complete.
P16-PR-04 is current.
P16 closes only after this PR validates.

Customer linking is readiness-only unless existing safe patterns support it.
customer linking is readiness-only unless existing safe patterns support it.
The current backend may reuse the existing workspace-scoped customer repository
path for extension bridge records, but it must not auto-merge risky identities
or trust frontend organization/workspace fields.

Backend ingestion accepts only sanitized/redacted extension snapshots.
Deduplication and idempotency are required.
Conversation linking is workspace-scoped.
conversation linking is workspace-scoped.
Client-supplied workspaceId is not authoritative.
AuthContext and workspace membership remain source of truth.
