# CLARA P17 AI Secret Boundary Policy

P16 Extension-Assisted Channel Ingestion Hardening is complete.
P16-PR-04 is complete.
P17 Real AI Analysis Activation is current.
P17-PR-01 is current.

AI provider secrets are server-only.
AI provider secrets must not be exposed to dashboard or extension.
AI provider secrets must not be logged, persisted, audited, or returned in API responses.

No AI API key is hard-coded. No frontend/public AI secret env var exists.
Do not add VITE_AI_API_KEY, NEXT_PUBLIC_AI_API_KEY, PUBLIC_AI_API_KEY, or any
frontend-readable secret.

Raw prompts, raw customer messages, raw provider payloads, raw provider
responses, tokens, cookies, auth headers, raw DOM, raw HTML, raw webhook
payloads, and payment data must not be logged or stored.
