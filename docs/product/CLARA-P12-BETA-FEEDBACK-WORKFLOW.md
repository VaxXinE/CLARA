---
project: "CLARA"
artifact: "P12 Beta Feedback Workflow"
status: "active"
owner: "CLARA Product and Support"
classification: "beta-feedback-readiness"
---

# CLARA P12 Beta Feedback Workflow

P12-PR-01 is complete. P12-PR-02 is complete. P12-PR-03 is complete. P12-PR-04 is current.

CLARA is not GA yet.

The beta feedback workflow is controlled and privacy-safe.

Known issues must be reviewed before GA.

Feedback/support must not collect raw sensitive data.

No external support tool integration happens in this PR.

No auto-send or external ticket creation happens in this PR.

No provider/payment/AI/outbound activation happens in this PR.

## Intake Fields

- feedback id
- date/time
- reporter role
- workspace category, not raw workspace secret/id unless safe
- affected area
- environment category
- severity
- reproducibility
- expected behavior
- actual behavior summary
- safe reproduction steps
- safe screenshot policy
- safe logs policy
- known issue link
- triage owner
- status
- decision
- GA blocker flag

## Flow

1. Collect feedback through controlled beta channel.
2. Remove forbidden data before triage.
3. Assign severity and triage owner.
4. Link or create a known issue record.
5. Mark decision: accepted beta limitation, fix planned, GA blocker, or deferred.
6. Feed unresolved blockers into P12-PR-05 final GA audit/runbook.
