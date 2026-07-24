# CLARA P16 Runtime QA Checklist

P15 Controlled Internal Beta Execution is complete.
P16 Extension-Assisted Channel Ingestion Hardening is current.
P16-PR-01 is complete.
P16-PR-02 is complete.
P16-PR-03 is complete.
P16-PR-04 is current.
P16 closes only after this PR validates.

- Verify backend ingestion accepts only sanitized/redacted extension snapshots.
- Verify deduplication and idempotency are required and enforced.
- Verify conversation linking is workspace-scoped.
- Verify customer linking is readiness-only unless existing safe patterns support it.
- Verify client-supplied workspaceId is not authoritative.
- Verify AuthContext and workspace membership remain source of truth.
- Verify cross-workspace spoofing must be rejected.
- Verify runtime QA evidence must minimize customer-sensitive data.
- Verify evidence/logs/docs/runbooks must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data.
- Verify extension-assisted ingestion is not official WA/IG/TikTok API activation.
- Verify official WA/IG/TikTok APIs remain not activated.
- Verify extension-assisted ingestion is not public SaaS launch.
- Verify extension-assisted ingestion is not production deployment claim unless separately executed.
- Verify billing/payment is deferred.
- Verify real AI provider calls remain not activated in this PR.
- Verify provider/AI/outbound activation remains controlled.
- Verify no outbound auto-send is activated.
- Verify P17 real AI analysis activation is next.
