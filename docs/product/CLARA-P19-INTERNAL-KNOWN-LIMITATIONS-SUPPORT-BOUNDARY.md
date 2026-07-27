# CLARA P19 Internal Known Limitations Support Boundary

Known limitations:

- Internal handoff is not public GA launch.
- Internal handoff is not public SaaS launch.
- Billing/payment remains deferred.
- Official WA/IG/TikTok APIs remain not activated.
- Outbound auto-send remains disabled.
- Mock/demo mode remains dev/test only.
- Provider auth and real workspace membership are required for internal team usage.

Support boundary:

- Report internal CRM workflow, auth, workspace, role, and deployment smoke issues.
- Do not include raw secrets/tokens/auth headers/raw provider payloads/raw prompts/raw DOM/raw HTML/payment data in support artifacts.
- Backend AuthContext/workspace membership is source of truth.
- client-supplied workspaceId is not authoritative.
- Missing/inactive membership fails closed.

