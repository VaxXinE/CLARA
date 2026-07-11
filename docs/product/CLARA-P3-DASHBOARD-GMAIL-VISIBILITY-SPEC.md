---
project: "CLARA"
artifact: "P3 Dashboard Gmail Visibility Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-11"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-SCHEDULER-OPERATOR-STATUS-SPEC.md"
  - "./CLARA-P3-GMAIL-SCHEDULER-MANUAL-TICK-SPEC.md"
  - "../../apps/dashboard/README.md"
---

# CLARA P3 Dashboard Gmail Visibility

## Purpose

Add read-only Gmail scheduler visibility and defensive conversation source badges to the dashboard.

## Dashboard Behavior

- Reads `GET /api/v1/integrations/gmail/scheduler/status`.
- Shows enabled/disabled, running/stopped, interval, per-tick limits, last tick status, reason code, and safe timestamps.
- Shows source badges for Gmail, email, WhatsApp, web chat, unknown, and future custom channel labels.
- Does not expose tokens, Authorization headers, raw Gmail payloads, or provider raw errors.

## Non-Goals

- No dashboard manual tick button.
- No OAuth connect or Gmail account management UI.
- No Gmail outbound send.
- No AI draft generation or AI auto-send changes.
