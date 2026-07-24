# CLARA P17 Prompt-Injection Boundary Policy

P17-PR-02 is current.
Prompt-injection boundaries are required.

## Boundary

Customer text is untrusted input and must be separated from system/developer
instructions. Extension snapshot AI-ready context labels customer text as
untrusted and records safe prompt-injection intent detection metadata.

The boundary is preparation only. P17-PR-02 builds AI-ready context but does not
yet execute real AI provider calls.

## Non-Goals

Extension must not call AI providers directly. Outbound auto-send remains
disabled. Raw prompts must not be persisted. Raw AI provider payloads and
responses must not be persisted.
