---
project: "CLARA"
artifact: "CLARA Release Readiness Overview"
status: "active"
owner: "CLARA Product and Operations"
classification: "release-readiness"
---

# CLARA Release Readiness Overview

## Why P12 Exists

P12 Beta / GA Release Readiness turns the validated P11 baseline into release
candidate evidence. It is not feature expansion and includes no production
deployment in this docs refresh.

## Beta vs GA

- Beta readiness: controlled release candidate, smoke matrix, known issues,
  support workflow, rollback drill, and operator feedback loop.
- GA readiness: final audit/runbook after beta evidence is reviewed.

CLARA is not GA-ready yet.

## Release Candidate Flow

1. Define P12-PR-01 release criteria.
2. Run P12-PR-02 smoke matrix.
3. Review P12-PR-03 deployment checklist and rollback drill.
4. Operate P12-PR-04 feedback/support/known issues workflow.
5. Close P12-PR-05 final GA audit/runbook.

## Security Reminder

AuthContext stays authoritative, frontend role guard is UX-only, client
workspaceId is never authority, all release evidence is workspace-scoped, no raw
customer messages, no raw provider payload, no raw webhook payload, no raw usage
events, no raw payment data, no raw telemetry, no access token, no refresh
token, no cookies, no payment provider integration, no charging customers, no
invoice creation, no quota enforcement, and no real AI provider.
