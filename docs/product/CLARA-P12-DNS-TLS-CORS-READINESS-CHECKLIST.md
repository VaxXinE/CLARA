---
project: "CLARA"
artifact: "P12 DNS TLS CORS Readiness Checklist"
status: "active"
owner: "CLARA Engineering and Operations"
classification: "network-readiness"
---

# CLARA P12 DNS / TLS / CORS Readiness Checklist

P12-PR-01 is complete. P12-PR-02 is complete. P12-PR-03 is current.

CLARA is not GA yet. CLARA is not production deployed yet.

The deployment checklist is a readiness gate, not deployment execution.

No real provider/payment/AI/outbound activation happens in this PR.

## Required Checks

- Domain/DNS target, TTL, rollback target, and owner are documented.
- TLS/HTTPS certificate validity is confirmed before cutover.
- CORS origin is explicit for production-like runtime; wildcard production CORS is no-go.
- Dashboard API base URL matches the approved domain.
- Auth redirect/callback domains are reviewed before provider activation.
- No private internal URL, token, cookie, auth header, or provider secret is recorded in evidence.
