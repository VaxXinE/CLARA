# CLARA P16 End-to-End Smoke Runbook

P15 Controlled Internal Beta Execution is complete.
P16 Extension-Assisted Channel Ingestion Hardening is current.
P16-PR-01 is complete.
P16-PR-02 is complete.
P16-PR-03 is complete.
P16-PR-04 is current.
P16 closes only after this PR validates.

Local/dev-safe smoke path:

1. Run API, dashboard, and extension tests.
2. Submit one sanitized/redacted extension snapshot with mock auth.
3. Submit the same snapshot again and verify duplicate/idempotent response.
4. Submit a body/query with client-supplied workspaceId and verify rejection.
5. Verify safe audit/event summary does not include sensitive payloads.

Backend ingestion accepts only sanitized/redacted extension snapshots.
Deduplication and idempotency are required. Conversation linking is
workspace-scoped. Customer linking is readiness-only unless existing safe
patterns support it.

Extension-assisted ingestion is not official WA/IG/TikTok API activation.
Official WA/IG/TikTok APIs remain not activated. Billing/payment is deferred.
Real AI provider calls remain not activated in this PR. No outbound auto-send
is activated.
