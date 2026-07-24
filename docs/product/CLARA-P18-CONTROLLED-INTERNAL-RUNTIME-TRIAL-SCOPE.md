# CLARA P18 Controlled Internal Runtime Trial Scope

P17 Real AI Analysis Activation is complete for controlled internal use.
P18 Controlled Internal Runtime Trial + Operational Readiness is current.
P18-PR-01 is complete.
P18-PR-02 is current.

P18 validates controlled internal runtime behavior only. The trial exercises the
completed pipeline: extension snapshot -> sanitization/redaction ->
workspace/operator attribution -> backend ingestion/dedup -> AI-ready context ->
controlled backend real AI analysis -> safe persistence -> dashboard review UI.

Scope:
- Internal operators run approved local/dev-safe trial flows.
- Admins review runtime evidence, audit/privacy evidence, and stop criteria.
- Trial evidence is privacy-safe and contains only summaries, counts, timestamps,
  safe reason codes, and safe screenshots with sensitive content redacted.

Guardrails:
- P18 is not public SaaS launch.
- P18 is not production deployment.
- P18 does not activate billing/payment.
- P18 does not activate official WA/IG/TikTok APIs.
- P18 does not enable outbound auto-send.
- Extension-assisted ingestion remains internal/controlled/user-assisted.
- AI analysis remains backend/server-side.
- AI provider secrets remain server-only.
- Extension must not call AI providers directly.
- Dashboard must show safe review output only.
- AuthContext and workspace membership remain source of truth.
- Client-supplied workspaceId is not authoritative.
- Runtime evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.
- Stop criteria are required before broader rollout.
- Manual rollback guidance is required before broader rollout.
- Known limitations must be reviewed before broader rollout.

Current PR: P18-PR-02 Controlled Runtime Trial Smoke Checklist + Evidence Capture.
