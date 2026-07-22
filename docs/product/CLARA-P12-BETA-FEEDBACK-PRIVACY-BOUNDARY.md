---
project: "CLARA"
artifact: "P12 Beta Feedback Privacy Boundary"
status: "active"
owner: "CLARA Security and Support"
classification: "privacy-boundary"
---

# CLARA P12 Beta Feedback Privacy Boundary

P12-PR-01 is complete. P12-PR-02 is complete. P12-PR-03 is complete. P12-PR-04 is current.

CLARA is not GA yet.

The beta feedback workflow is controlled and privacy-safe.

Feedback/support must not collect raw sensitive data.

No external support tool integration happens in this PR.

No auto-send or external ticket creation happens in this PR.

No provider/payment/AI/outbound activation happens in this PR.

## Forbidden Feedback Data

- passwords
- API keys
- access tokens
- refresh tokens
- cookies
- auth headers
- service role keys
- raw customer messages
- raw provider payloads
- raw webhook payloads
- raw audit metadata
- raw telemetry dumps
- payment data
- full database dumps
- raw DOM/HTML
- prompt dumps
- private personal data not needed for triage

## Safe Collection

Use summaries, categories, redacted screenshots, safe reproduction steps, role
category, environment category, affected area, and known issue link. Do not
collect secrets, raw logs, provider payloads, or customer-message content.
