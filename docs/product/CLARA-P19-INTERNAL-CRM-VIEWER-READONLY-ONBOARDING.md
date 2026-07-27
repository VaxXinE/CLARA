# CLARA P19 Internal CRM Viewer Read-Only Onboarding

P19-PR-05 is current/final onboarding handoff gate.

Viewer is read-only. Viewers may inspect allowed workspace-scoped CRM data but
must not create/update customers, add notes, change lifecycle/status, assign
owners, link conversations, send replies, trigger provider actions, or bypass
workspace membership checks.

Internal team usage must use provider auth. Real workspace membership is required.
Backend AuthContext/workspace membership is source of truth.
client-supplied workspaceId is not authoritative. Missing/inactive membership
fails closed.
