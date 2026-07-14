---
project: "CLARA"
artifact: "P6 Observability Spec"
status: "implemented"
owner: "CLARA Engineering and Security"
classification: "operations-spec"
---

# CLARA P6 Observability Spec

## Purpose

Observability gives operators safe provider/channel diagnostics without turning CLARA into an analytics product.

## Signals

Minimum safe signals:

- channel
- provider
- workspace-scoped status
- readiness level
- last health check time
- safeReasonCode
- retry count
- dead-letter count or dead-letter presence
- webhook accepted/rejected count concept
- outbound queued/sending/sent/failed/retrying/dead_letter concept
- provider degraded/outage state
- correlationId

## Safe Fields

Operational output must be derived from backend AuthContext or server-side channel account scope. Client-provided workspace ids are never authority.

Allowed diagnostics are limited to safe enum/status/count/timestamp/correlation fields.

## Disallowed Fields

Observability must include no access token, no refresh token, no cookies, no raw provider payload, no raw webhook body, no raw email body, no raw DOM, no raw HTML, no service role key, no OpenAI API key, and no sensitive provider error payload.

## Visibility Areas

- Health visibility uses channel health status and safe reason codes.
- Outbox visibility uses lifecycle counters and bounded retry/dead-letter status.
- Webhook visibility uses accepted, rejected, and replay/dedup counts.

## Non-Goals

No full metrics backend, dashboard analytics product, CRM analytics, billing analytics, provider scraping, or AI assistant behavior is implemented in P6-PR-04.
