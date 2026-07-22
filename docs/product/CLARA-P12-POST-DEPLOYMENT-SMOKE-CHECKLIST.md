---
project: "CLARA"
artifact: "P12 Post Deployment Smoke Checklist"
status: "active"
owner: "CLARA Operations"
classification: "smoke-readiness"
---

# CLARA P12 Post-Deployment Smoke Checklist

P12-PR-01 is complete. P12-PR-02 is complete. P12-PR-03 is current.

CLARA is not GA yet. CLARA is not production deployed yet.

The deployment checklist is a readiness gate, not deployment execution.

No real provider/payment/AI/outbound activation happens in this PR.

## Smoke Checks

- API `/health` returns safe success.
- API `/ready` returns expected readiness result.
- Unauthenticated protected API returns safe 401.
- Dashboard loads and can reach the configured API.
- Extension remains manual-assisted and cannot deploy, rollback, auto-send, or crawl background chats.
- Auth/session behavior uses backend AuthContext and does not trust client role/workspace.
- Workspace smoke confirms cross-workspace access remains blocked.
- Readiness-only panels remain read-only.
- AI review-only surfaces do not call real AI providers.
- Provider readiness remains gated.
- Billing readiness remains read-only.
- Analytics safe-summary surfaces remain aggregate-first.

Any smoke failure requires no-go review or rollback decision.
