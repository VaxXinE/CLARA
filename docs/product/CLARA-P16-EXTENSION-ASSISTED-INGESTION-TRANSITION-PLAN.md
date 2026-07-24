# CLARA P16 Extension-Assisted Ingestion Transition Plan

## Status

P14 Internal Beta Rollout Preparation is complete. P15 Controlled Internal Beta
Execution is current. P15-PR-01 is complete. P15-PR-02 is complete.
P15-PR-03 is complete. P15-PR-04 is current. P15 closes only after this PR
validates.

P16 Extension-Assisted Channel Ingestion Hardening is next. P16 focuses on
extension-assisted WA/IG/TikTok active chat capture. extension-assisted
ingestion is internal/controlled and user-assisted. extension-assisted ingestion
is not official WA/IG/TikTok API activation. extension-assisted ingestion is not
public SaaS launch. extension-assisted ingestion is not production deployment
claim unless separately executed.

billing/payment is deferred. official provider APIs remain not activated. real
AI provider calls remain not activated in this PR. provider/AI/outbound
activation remains controlled. feedback/support remains manual/local/repo-safe
unless separately approved. no external support tool integration is activated.
AuthContext and workspace membership remain source of truth.
client-supplied workspaceId is not authoritative.

evidence/issue reports/handoff/stabilization docs must not include
secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw
HTML/raw DOM/raw prompts/payment data.

## Transition Scope

- Harden consent, scope, and threat model for extension-assisted ingestion.
- Harden WA/IG/TikTok active chat reader and snapshot normalization boundaries.
- Keep channel capture user-assisted and internal/controlled.
- Do not treat extension-assisted ingestion as an official provider API
  replacement for public/commercial launch.
