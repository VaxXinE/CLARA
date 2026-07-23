# CLARA P14 Internal Feedback Privacy Boundary

## Status

P14-PR-05 is complete. P14-PR-06 is current. Internal usage feedback loop is for
internal beta rollout.

## Redaction Boundary

Feedback must not include secrets/tokens/cookies/auth headers/raw provider
payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data. Feedback
should minimize customer-sensitive data.

Allowed evidence:

- Redacted reproduction steps.
- Role labels such as owner, admin, operator, agent, or viewer.
- Safe page names and safe internal issue IDs.
- Aggregate impact notes.
- Redacted screenshots that do not show secrets or sensitive customer data.

Rejected evidence:

- Tokens, cookies, auth headers, API keys, client secrets, private keys.
- Raw provider payloads, raw webhook payloads, raw DOM, raw HTML, raw prompts.
- Payment card data, payment provider metadata, invoices, checkout data.
- Full customer transcripts or unnecessary customer-sensitive data.

no external support tool integration is activated.
