---
project: "CLARA"
artifact: "P19 Real Lifecycle Owner Workflow"
status: "current"
classification: "operator-runbook"
---

# P19 Real Lifecycle/Owner Workflow

Lifecycle/status and owner assignment are role-aware CRM workflows.

Owner/agent CRM mutation policy remains enforced. Viewer is read-only.
Owner assignment must choose an active workspace member only. Inactive or
cross-workspace members must be rejected by the backend.

Allowed status values remain bounded to the internal CRM lifecycle: new, active,
follow_up, at_risk, resolved, archived, and blocked.
