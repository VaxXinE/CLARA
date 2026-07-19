---
project: "CLARA"
artifact: "P9 Security Checklist"
status: "final"
owner: "CLARA Security and Engineering"
classification: "security-checklist"
---

# CLARA P9 Security Checklist

## Required Controls

- [ ] Backend AuthContext is the source of truth.
- [ ] Analytics routes require authentication.
- [ ] Analytics is workspace-scoped.
- [ ] Client-supplied workspaceId is never authority.
- [ ] Metrics are aggregate-first.
- [ ] Metric registry and contract are enforced.
- [ ] Unknown metric keys are blocked.
- [ ] Unknown categories are blocked.
- [ ] Unknown timeWindow/channel/filter values are blocked.
- [ ] Operator filters are role-gated.
- [ ] Cross-workspace analytics is blocked.
- [ ] Analytics access is safely audited.
- [ ] Sensitive metric requests are blocked or redacted.
- [ ] Dashboard renders safely without unsafe HTML.
- [ ] Dashboard has no export/download/raw drilldown UI.
- [ ] Extension cannot access analytics internals.

## Forbidden Output

- [ ] no raw customer messages
- [ ] no raw provider payload
- [ ] no raw webhook payload
- [ ] no raw audit metadata
- [ ] no access token
- [ ] no refresh token
- [ ] no cookies
- [ ] no auth headers
- [ ] no API keys/secrets
- [ ] no raw DOM
- [ ] no raw HTML
- [ ] no raw prompts

## Forbidden Behavior

- [ ] no CRM mutation
- [ ] no task creation
- [ ] no customer note write
- [ ] no owner assignment
- [ ] no lifecycle/status update
- [ ] no outbound send
- [ ] no scheduler execution
- [ ] no report export
- [ ] no customer-level drilldown
- [ ] no real AI provider

## Final Gate

Run:

```bash
bash scripts/validate-p9-final-analytics-reporting-audit-runbook.sh
```

Expected:

```text
CLARA P9-PR-06 VALIDATION PASSED
```
