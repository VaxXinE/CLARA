# CLARA P14 Internal Security Checklist

## Purpose

security checklist exists as the internal beta gate before CLARA is used by the
internal team beyond local/dev-safe validation.

P14-PR-01 is complete. P14-PR-02 is current. Internal user setup is for
internal beta rollout. owner/admin/operator/viewer roles are defined.

## Required Checks

- [ ] internal use first is confirmed.
- [ ] billing deferred is confirmed.
- [ ] public launch deferred is confirmed.
- [ ] production deployment requires separate explicit action.
- [ ] Provider/AI/outbound activation remains controlled.
- [ ] Internal user roles are defined and mapped to owner, admin, agent, and
  viewer responsibilities.
- [ ] Owner/admin/operator/viewer roles are defined for internal user setup.
- [ ] Backend AuthContext and workspace membership remain source of truth.
- [ ] Client supplied workspaceId is not authoritative.
- [ ] Internal data policy exists and is accepted by operators.
- [ ] No real `.env` file is committed.
- [ ] No production secret, token, private key, payment credential, provider
  credential, or service role credential is committed.
- [ ] Backend AuthContext remains the source of truth.
- [ ] Client-supplied role, organization_id, workspace_id, or user_id is never
  authorization truth.
- [ ] Workspace isolation tests pass.
- [ ] Dashboard role checks remain UX-only.
- [ ] Logs do not include tokens, cookies, Authorization headers, provider raw
  payloads, raw webhook payloads, or sensitive customer content.
- [ ] AI behavior remains review-only/suggestion-only unless later approved.
- [ ] Outbound sends remain controlled and do not auto-send.
- [ ] Provider integrations remain disabled or explicitly guarded.
- [ ] Known limitations are documented before broader internal rollout.

## Go / No-Go Rule

If any required security check fails, internal beta rollout pauses. The owner or
admin must record the blocker and rerun validation after the fix. Passing this
checklist does not mean production deployed and does not mean public GA launch.
