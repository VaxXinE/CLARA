# CLARA P19 Internal CRM Admin Owner Onboarding

P19-PR-04 is complete. P19-PR-05 is current/final onboarding handoff gate.
P19 completion requires P19-PR-05 validation and merge.

Owner/admin setup:

1. Confirm provider auth is configured.
2. Confirm real workspace membership exists for every internal user.
3. Confirm missing/inactive membership fails closed before inviting operators.
4. Confirm owner/agent CRM mutation policy remains enforced.
5. Confirm viewer is read-only.

Backend AuthContext/workspace membership is source of truth.
client-supplied workspaceId is not authoritative. Mock/demo mode is dev/test
only. Internal team usage must use provider auth.

Do not add billing/payment, official WA/IG/TikTok APIs, public SaaS launch,
public GA launch, or outbound auto-send during onboarding.

