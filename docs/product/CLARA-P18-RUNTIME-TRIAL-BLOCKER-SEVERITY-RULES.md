# CLARA P18 Runtime Trial Blocker Severity Rules

P18-PR-02 is complete.
P18-PR-03 is current.

## Blocker

- Secret/token/cookie/auth header exposure.
- Workspace isolation bypass or client-supplied workspaceId treated as authoritative.
- Extension direct AI provider call.
- AI provider secret exposed outside server boundary.
- Raw prompt, raw customer message as prompt, raw provider payload, raw webhook payload, raw HTML, or raw DOM persisted or captured as evidence.
- Outbound auto-send activation.
- Official WA/IG/TikTok API activation.
- Billing/payment activation, public SaaS launch claim, or production deployment claim.

## High

- Controlled backend AI analysis does not fail closed.
- Evidence redaction or retention/disposal rule is skipped.
- Dashboard review UI exposes unsafe analysis details.
- Backend ingestion/dedup loses workspace attribution.

## Medium

- Smoke checklist step is unclear or cannot be reproduced.
- Safe reason_code is missing from a failure result.
- Known issue entry is incomplete but contains no sensitive data.

## Low

- Documentation typo or non-blocking operator guidance issue.
