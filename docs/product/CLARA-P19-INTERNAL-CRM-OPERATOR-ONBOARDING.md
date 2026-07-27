# CLARA P19 Internal CRM Operator Onboarding

P19-PR-04 is complete. P19-PR-05 is complete. P19 is complete.

Operators use CLARA for daily internal CRM work only through provider auth.
internal team usage must use provider auth.
Mock/demo mode is dev/test only and must not be used for real work. Real
workspace membership is required. Backend AuthContext/workspace membership is
source of truth. client-supplied workspaceId is not authoritative.
Missing/inactive membership fails closed.
Backend AuthContext/workspace membership is source of truth.

Operator scope:

- Customer create/update/notes/activity/lifecycle/owner/conversation-linking are real workspace-scoped CRM workflows.
- Owner/agent CRM mutation policy remains enforced.
- Viewer is read-only.
- Internal deployment usage smoke checklist exists.
- Issue reporting and escalation workflow exists.
- Operator security do/don't guide exists.

Guardrails: CLARA is not public GA launch. CLARA is not public SaaS launch.
Billing/payment remains deferred. Official WA/IG/TikTok APIs remain not
activated. Outbound auto-send remains disabled. No raw secrets/tokens/auth
headers/raw provider payloads/raw prompts/raw DOM/raw HTML/payment data in docs.
Official WA/IG/TikTok APIs remain not activated.
