---
project: "CLARA"
artifact: "P12 Production Config Readiness Checklist"
status: "active"
owner: "CLARA Product and Engineering"
classification: "config-readiness"
---

# CLARA P12 Production Config Readiness Checklist

P12-PR-01 is complete. P12-PR-02 is complete. P12-PR-03 is current.

CLARA is not GA yet. CLARA is not production deployed yet.

The deployment checklist is a readiness gate, not deployment execution.

No real provider/payment/AI/outbound activation happens in this PR.

## Required Checks

- API runtime config uses production-safe auth mode, explicit database URL, explicit CORS, safe log level, rate limit, and request size limits.
- Dashboard runtime config uses the approved API base URL and public provider config only.
- Extension runtime config remains user-assisted and cannot deploy production or rollback production.
- Auth provider / JWKS / issuer config is validated before provider mode.
- Workspace membership remains backend-authoritative.
- Provider readiness is reviewed before any real provider activation.
- Billing readiness remains read-only and cannot charge, invoice, checkout, mutate subscriptions, or enforce quota.
- AI review-only surfaces do not call a real provider and do not auto-send.
- Analytics safe-summary surfaces do not expose raw events, raw customer content, or raw provider payload.
