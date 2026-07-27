---
project: "CLARA"
artifact: "P19 Real CRM Data Safety Policy"
status: "current"
classification: "security-policy"
---

# P19 Real CRM Data Safety Policy

Real CRM records may contain customer contact details and internal notes, so all
runtime output must stay scoped and safe.

Never persist or render tokens, cookies, Authorization headers, Supabase service
role keys, provider secrets, AI provider secrets, raw provider payloads, raw AI
responses, raw prompts, raw HTML, raw DOM, or payment data.

Errors must be human-readable and safe. They must not expose database internals,
provider internals, JWT payloads, or workspace IDs from other tenants.
