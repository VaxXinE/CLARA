---
project: "CLARA"
artifact: "P6 Go-Live Checklist"
status: "implemented"
owner: "CLARA Engineering and Security"
classification: "go-live-checklist"
---

# CLARA P6 Go-Live Checklist

Before production provider use:

- auth mode provider-ready
- runtime config doctor pass
- channel readiness reviewed
- Gmail credential boundary reviewed
- channel health reviewed
- webhook validation reviewed
- retry/idempotency reviewed
- observability/audit policy reviewed
- extension bridge reviewed
- incident runbook reviewed
- known limitations accepted
- backend AuthContext confirmed as authorization source of truth
- workspace-scoped provider boundaries confirmed
- no access token, no refresh token, no cookies, and no raw provider payload in frontend/runtime diagnostics

P6 complete does not mean real WhatsApp, Instagram, TikTok, billing, CRM analytics, or AI assistant automation is production-ready.
