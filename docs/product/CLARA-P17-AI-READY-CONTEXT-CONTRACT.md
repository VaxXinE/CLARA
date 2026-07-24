# CLARA P17 AI-Ready Context Contract

P17 Real AI Analysis Activation is current.
P17-PR-01 is complete.
P17-PR-02 is current.
P17-PR-02 builds AI-ready context but does not yet execute real AI provider calls.

## Required Source

AI-ready context must come only from sanitized/redacted extension snapshots.
AuthContext and workspace membership remain source of truth.
Client-supplied workspaceId is not authoritative.

## Required Shape

The context includes safe workspace scope, safe channel metadata, snapshot hash,
bounded chat metadata, bounded messages, untrusted customer text labels,
prompt-injection metadata, and budget summary.

The context must not include raw DOM, raw HTML, raw provider payloads, raw
webhook payloads, raw prompts, raw customer messages as AI prompts, raw AI
provider payloads and responses, tokens, cookies, auth headers, API keys,
secrets, payment data, or frontend-readable AI secrets.

## Next

P17-PR-03 is next: Real AI Analysis Output + Persistence + Dashboard Review UI.
