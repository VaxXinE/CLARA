---
project: "CLARA"
artifact: "P6 Production Provider Runbook"
status: "implemented"
owner: "CLARA Engineering and Security"
classification: "operator-runbook"
---

# CLARA P6 Production Provider Runbook

## Gmail auth_required Or Degraded

Check Channel Health for `auth_required` or `degraded`. Reconnect only through approved OAuth. Do not inspect or print tokens.

## Webhook Rejection Spike

Review safeReasonCode counts for `webhook_rejected_safe`. Check provider signature config and request-size/rate guardrails. Do not log raw webhook body.

## Webhook Replay Suspicion

Review `webhook_replay_detected` and dedup counters. Confirm provider event id or normalized hash behavior is workspace-scoped.

## Outbound Retry Storm

Check retry count, `outbound_retry_scheduled`, and max attempts. Stop provider sends if retry count grows unexpectedly.

## Dead-Letter Review

Review `outbound_dead_lettered` records by provider, channel, workspace, safeReasonCode, and correlationId. Do not resend until the provider error class is understood.

## Duplicate-Send Suspicion

Check idempotency scope by organization, workspace, channel, account, and caller key. Escalate if no double-send guard failed.

## Provider Outage

Mark provider degraded/outage in operational notes and avoid provider-specific retries that could amplify rate limits.

## Extension Abuse Suspicion

Verify the extension bridge remains active visible chat only, user-assisted, and manual. Disable extension bridge access if abuse is suspected.

## Raw Payload Or Token Exposure Suspicion

Treat as a security incident. Rotate affected provider credentials, preserve logs safely, and verify no access token, no refresh token, no cookies, and no raw provider payload are exposed.

## Rollback And Escalation

Rollback the latest provider/channel change, keep production config guardrails enabled, and escalate to Engineering plus Security with correlationId examples only.
