# CLARA P19 Internal Usage Smoke Checklist

Internal deployment usage smoke checklist exists.

- Provider sign-in works.
- Demo role switcher is hidden in provider mode.
- Mock headers are not sent in provider mode.
- Real workspace membership is required.
- Missing/inactive membership fails closed.
- Viewer is read-only.
- Owner/agent can perform allowed customer create/update/notes/activity/lifecycle/owner/conversation-linking workflows.
- Protected API without auth returns safe 401.
- No raw secrets/tokens/auth headers/raw provider payloads/raw prompts/raw DOM/raw HTML/payment data in docs or smoke evidence.

CLARA is not public GA launch. CLARA is not public SaaS launch.

