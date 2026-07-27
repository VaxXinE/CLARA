---
project: "CLARA"
artifact: "P19 Real CRM Viewer Readonly Policy"
status: "current"
classification: "security-policy"
---

# P19 Real CRM Viewer Readonly Policy

Viewer is read-only across real CRM workflows.

Viewer may inspect workspace-scoped customer profile, conversation, notes,
timeline, and readiness summaries where read permission allows it. Viewer must
not create/update customers, notes, lifecycle status, owner assignment,
conversation-customer links, follow-up tasks, replies, AI drafts, or outbound
sends.

Frontend read-only controls are usability hints only. Backend AuthContext and
workspace membership remain source of truth.
