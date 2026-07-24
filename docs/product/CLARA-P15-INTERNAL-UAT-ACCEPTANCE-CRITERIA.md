# CLARA P15 Internal UAT Acceptance Criteria

## Status

P14 Internal Beta Rollout Preparation is complete. P15 Controlled Internal Beta
Execution is current. P15-PR-01 is complete. P15-PR-02 is complete.
P15-PR-03 is complete. P15-PR-04 is current.

user acceptance session is internal-only. UAT issue capture is
manual/local/repo-safe unless separately approved. UAT is not public SaaS
launch. UAT is not production deployment claim unless separately executed.
billing/payment is deferred. provider/AI/outbound activation remains
controlled. feedback/support remains manual/local/repo-safe unless separately
approved. no external support tool integration is activated. AuthContext and
workspace membership remain source of truth. client-supplied workspaceId is not
authoritative.

## Criteria

- Core internal CRM workflows are understandable to internal users.
- Viewer/read-only paths remain non-mutating.
- Errors are safe and actionable.
- Issues are captured with severity, priority, role, component, safe summary,
  and reproduction steps.
- Any auth, workspace isolation, sensitive evidence, or accidental activation
  issue blocks broader internal rollout until reviewed.

Evidence and issue reports must not include secrets/tokens/cookies/auth
headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw
prompts/payment data. Evidence and issue reports should minimize
customer-sensitive data.
