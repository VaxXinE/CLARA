---
project: "CLARA"
artifact: "P11 Rate Limit Quota Runbook"
status: "draft"
owner: "CLARA Engineering, Security, and Operations"
classification: "operations-runbook"
---

# CLARA P11 Rate Limit Quota Runbook

## Safe Rate Limit Principles

- Rate Limit policy must be workspace-scoped.
- Safe 429 responses must not expose internals.
- Before auth context exists, IP or request metadata may be used only as a safe
  fallback.
- Do not log tokens, cookies, auth headers, raw usage events, raw customer
  messages, raw provider payload, or raw webhook payload.

## 429 Behavior Checklist

- Safe status code: 429.
- Safe message only.
- Correlation id included where available.
- No quota counters, token values, provider internals, or raw payloads.

## Soft Limit Checklist

- Define soft limit threshold.
- Define operator warning behavior.
- Keep output aggregate-first and workspace-scoped.
- Do not charge customers.

## Hard Limit Checklist

- Define hard limit threshold.
- Define safe blocked-state messaging for a future PR.
- Do not add quota enforcement in P11-PR-03.
- Do not mutate plan, entitlement, subscription, or workspace state.

## Grace Period Checklist

- Define grace period semantics.
- Define operational override review.
- Keep backend AuthContext as source of truth.

## Future Quota Enforcement Rollout

Future quota enforcement needs a separate PR with security review, billing
review, tenant isolation tests, rollback plan, and customer communication plan.

P11-PR-03 has no production quota blocking, no payment provider integration, no
charging customers, no invoice creation, no subscription mutation, no plan
mutation, no entitlement mutation, no CRM mutation, no outbound send, and no
real AI provider.
