# CLARA P18 Runtime Trial Evidence Redaction Rules

P18-PR-02 is complete.
P18-PR-03 is current.

## Must Redact Or Exclude

- Secrets, tokens, cookies, auth headers, API keys, private credentials.
- Raw provider payload, raw webhook payload, raw HTML, raw DOM, full page dumps.
- Raw prompts, raw customer messages as prompts, raw AI provider payloads, raw AI responses.
- Payment data, billing identifiers, card data, invoice data, checkout data.
- Hidden conversations, background inbox captures, mass scrape output.

## Allowed Evidence Shape

- Safe status.
- Safe counts.
- Safe reason_code.
- Safe timestamps.
- Redacted screenshot with no visible customer-sensitive content.
- Sanitized issue ID and checklist reference.

Runtime evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.
