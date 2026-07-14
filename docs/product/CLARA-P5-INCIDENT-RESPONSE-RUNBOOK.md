# CLARA P5 Incident Response Runbook

## Provider Outage

Impact: users cannot establish or refresh provider sessions.

Actions:

- Confirm `/health` and `/ready`.
- Check provider status outside CLARA.
- Do not enable mock auth in production as a workaround.
- Communicate degraded login status to operators.

## JWT Or JWKS Rotation Failure

Impact: valid users may receive safe 401 responses.

Actions:

- Verify `SUPABASE_AUTH_JWKS_URL` and `SUPABASE_AUTH_ISSUER`.
- Restart only after platform environment is corrected.
- Confirm no Authorization headers or tokens are present in logs.

## Provider Session Without Workspace Membership

Impact: dashboard shows workspace access required and product data does not
load.

Actions:

- Verify provider subject to CLARA user mapping.
- Verify exactly one active workspace membership.
- Confirm role is owner, agent, or viewer.

## Owner Bootstrap Mistake

Impact: no operator can access owner-only readiness data.

Actions:

- Repair membership directly through an audited database process.
- Record actor, timestamp, reason, and affected user.
- Do not add a public self-escalation endpoint.

## Suspicious Role Escalation Attempt

Impact: client may try to spoof role, organization, or workspace.

Actions:

- Review safe API logs by correlation ID.
- Confirm backend ignored query/body/header role spoofing.
- Confirm no invite, update role, or delete user endpoint exists in P5.

## Suspected Token Or Secret Exposure

Actions:

- Rotate affected provider credentials immediately.
- Search logs for token-like material.
- Confirm dashboard config does not contain privileged provider keys.
- Confirm extension did not read cookies, provider tokens, or raw provider
  payloads.
