# CLARA P17 AI Context Budget Policy

P17-PR-02 is current.
AI context size budgets are required.

## Budget Rules

Extension snapshot AI context must enforce a message-count budget and a
per-message character budget. The builder keeps the latest bounded messages,
truncates text through the existing AI text sanitizer, and returns a safe budget
summary only.

Budget summaries must not include raw prompts, raw customer messages, raw
provider payloads, raw AI provider payloads, tokens, cookies, auth headers,
payment data, or secrets.

## Boundaries

P17-PR-02 builds AI-ready context but does not yet execute real AI provider calls.
P17-PR-03 is next: Real AI Analysis Output + Persistence + Dashboard Review UI.
