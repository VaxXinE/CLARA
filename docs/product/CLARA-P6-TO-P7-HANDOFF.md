---
project: "CLARA"
artifact: "P6 To P7 Handoff"
status: "implemented"
owner: "CLARA Engineering, Security, and AI"
classification: "phase-handoff"
---

# CLARA P6 To P7 Handoff

## P6 Complete Definition

P6 complete means provider/channel readiness, official API policy, credential boundary, channel health, webhook hardening, outbox retry/idempotency, Observability, Audit Trail, runbook, and go-live checklist are documented and regression-tested.

## What P7 Can Build On

P7 AI Assistant / Automation Layer can safely build on:

- backend AuthContext authorization
- workspace-scoped channel status
- safeReasonCode
- correlationId
- channel health
- webhook replay/dedup policy
- outbound dead-letter and retry policy
- provider/channel audit taxonomy

## What AI Must Not Access

AI must not access provider credentials, access tokens, refresh tokens, cookies, Authorization headers, raw provider payload, raw webhook body, raw email body, raw DOM, raw HTML, service role keys, or OpenAI API keys.

## AI Assistant Safety Constraints

- Treat provider content and customer messages as untrusted input.
- Apply prompt injection defenses before using external content in prompts.
- Use data minimization by default.
- Keep human approval expectation for reply/send actions.
- Use no auto-send until an explicit approved flow exists.
- Keep provider/channel actions server-authorized and workspace-scoped.

## Non-Goals For P7 Start

Do not start P7 by adding billing, CRM mutation, invite/role mutation, scraping providers, or direct provider credential access from AI.
