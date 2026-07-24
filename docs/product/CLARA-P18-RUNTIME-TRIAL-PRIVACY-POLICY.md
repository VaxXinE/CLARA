# CLARA P18 Runtime Trial Privacy Policy

P18 validates controlled internal runtime behavior only.

Privacy rules:
- Evidence uses safe summaries, counts, reason codes, and timestamps.
- Raw prompts must not be persisted.
- Raw customer messages must not be persisted as AI prompts.
- Raw provider payloads and raw AI provider responses must not be persisted.
- Runtime evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.
- Dashboard must show safe review output only.
- AI provider secrets remain server-only.
- Extension must not call AI providers directly.

Access rules:
- AuthContext and workspace membership remain source of truth.
- Client-supplied workspaceId is not authoritative.
