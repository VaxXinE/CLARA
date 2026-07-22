---
project: "CLARA"
artifact: "P12 RC Evidence Checklist"
status: "active"
owner: "CLARA Product and Engineering"
classification: "rc-evidence-checklist"
---

# CLARA P12 RC Evidence Checklist

## Required Evidence

- Branch name.
- Commit SHA.
- Validator output.
- API test count and build result.
- Dashboard test count and build result.
- Extension test count and build result.
- Production dependency audit result showing 0 vulnerabilities for
  `--omit=dev --audit-level=high`.
- Local smoke test result.
- Beta smoke test result or explicit not-run reason.
- Known limitations review.
- No-go blocker review.
- Security boundary confirmation.

## Evidence Safety

Evidence must not include tokens, cookies, Authorization headers, API keys,
secrets, raw customer messages, raw provider payloads, raw webhook payloads, raw
audit metadata, raw usage events, raw payment data, raw telemetry, raw DOM, raw
HTML, or raw prompts.
