---
project: "CLARA"
artifact: "P3 Gmail Inbound Scheduler Lifecycle Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-11"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-SCHEDULER-RUNTIME-BOUNDARY-SPEC.md"
  - "./CLARA-P3-GMAIL-INBOUND-SYNC-SCHEDULER-SKELETON-SPEC.md"
  - "./CLARA-P3-GMAIL-SCHEDULER-OPERATOR-STATUS-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Gmail Inbound Scheduler Lifecycle

## Purpose

Wire the Gmail inbound scheduler runtime into the API app lifecycle without enabling background Gmail work by default.

## Behavior

- No runtime wired means no scheduler startup.
- Wired runtime starts from the app readiness lifecycle.
- Duplicate readiness bootstrap does not create duplicate starts.
- App close stops the runtime.
- Startup and shutdown failures are logged safely and do not expose token material.
- The operator status route may read safe runtime state/config when the scheduler status service is wired.

## Non-Goals

- No external cron.
- No queue adapter.
- No distributed lock.
- No Gmail outbound send.
- No AI draft generation or AI auto-send.
