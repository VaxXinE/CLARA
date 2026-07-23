# CLARA P15 Internal UAT Session Plan

## Status

P14 Internal Beta Rollout Preparation is complete. P15 Controlled Internal Beta
Execution is current. P15-PR-01 is complete. P15-PR-02 is complete.
P15-PR-03 is current.

user acceptance session is internal-only. UAT issue capture is
manual/local/repo-safe unless separately approved. UAT is not public SaaS
launch. UAT is not production deployment claim unless separately executed.
billing/payment is deferred. provider/AI/outbound activation remains
controlled. feedback/support remains manual/local/repo-safe unless separately
approved. no external support tool integration is activated. AuthContext and
workspace membership remain source of truth. client-supplied workspaceId is not
authoritative.

## Session Flow

1. Confirm participant role: operator, admin, or viewer.
2. Run the matching UAT script.
3. Capture pass/fail/blocker notes with safe evidence only.
4. File issues manually in repo-safe/local records.
5. Escalate security, auth, workspace isolation, or data exposure failures.

Evidence and issue reports must not include secrets/tokens/cookies/auth
headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw
prompts/payment data. Evidence and issue reports should minimize
customer-sensitive data.
