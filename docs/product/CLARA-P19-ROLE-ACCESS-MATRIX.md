---
project: "CLARA"
artifact: "P19 Role Access Matrix"
status: "current"
owner: "CLARA Product and Engineering"
classification: "access-control"
---

# P19 Role Access Matrix

| Role | Internal CRM Access | Mutation Boundary |
| --- | --- | --- |
| Owner | Workspace access, access readiness, owner-permitted CRM actions | Backend policy decides |
| Agent | Assigned workspace CRM work | Backend policy decides |
| Viewer | Assigned workspace inspection | Read-only |

Viewer is read-only. Owner/agent CRM mutation policy remains enforced.
Backend AuthContext/workspace membership is source of truth.
client-supplied workspaceId is not authoritative.

Mock/demo mode is dev/test only. Internal team usage must use provider auth.
