# CLARA P19 Internal CRM Deployment Runtime

P19-PR-03 is complete. P19-PR-04 is current. P19-PR-05 is next:
Internal CRM Operator Onboarding + Production-like Usage Handoff.

This runtime path lets the internal team use CLARA from an internal URL. It is
not public GA launch, not public SaaS launch, and not production deployment.
Billing/payment remains deferred. Official WA/IG/TikTok APIs remain not
activated. Outbound auto-send remains disabled.

Internal team usage must use provider auth. Mock/demo mode is dev/test only and
is not the internal deployment path. Internal deployment requires real workspace
membership. Backend AuthContext/workspace membership is source of truth.
client-supplied workspaceId is not authoritative. Missing/inactive membership
fails closed.

Runtime checks:

- API runs from `npm run build` then `npm run start`.
- Dashboard runs from `npm run build` and serves the static `dist/` artifact.
- Dashboard provider mode must not show demo role switcher.
- Dashboard provider mode must not send mock headers.
- CORS/internal origin must be explicit and not wildcard.
- Env examples must not contain real secrets.

