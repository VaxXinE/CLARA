# CLARA P17 Final Extension-Assisted AI Smoke Runbook

Smoke flow:
1. Capture sanitized extension snapshot from the active visible chat.
2. Build AI-ready context.
3. Execute controlled backend real AI analysis with mock provider for local/dev-safe validation.
4. Persist only safe/redacted analysis result.
5. Load the dashboard review UI and confirm only safe output is shown.

Expected results:
- Real AI analysis is server-only.
- Extension must not call AI providers directly.
- AI provider secrets must not be exposed to dashboard or extension.
- Raw prompts are not persisted.
- Raw customer messages are not persisted as AI prompts.
- Raw AI provider payloads and responses are not persisted.
- Outbound auto-send remains disabled.
