# CLARA P18 Runtime Trial Roadmap

P17 Real AI Analysis Activation is complete for controlled internal use.
P18 Controlled Internal Runtime Trial + Operational Readiness is current.
P18-PR-01 is complete.
P18-PR-02 is complete.
P18-PR-03 is complete.
P18-PR-04 is current/final handoff gate.
P18 is considered complete only after P18-PR-04 validates and merges.

P18 validates controlled internal runtime behavior only.

## PR Plan

- P18-PR-01 Controlled Internal Runtime Trial Scope + Evidence Plan. Complete.
- P18-PR-02 Controlled Runtime Trial Smoke Checklist + Evidence Capture. Complete.
- P18-PR-03 Controlled Runtime Trial Execution + Evidence Log. Complete.
- P18-PR-04 Final Controlled Runtime Trial Review + Operational Handoff. Current/final handoff gate.

## Guardrails

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
- Smoke checklist, pass/fail criteria, evidence capture, execution log, evidence log, run summary, issue disposition, signoff records, evidence privacy review, stop/rollback decision record, issue capture, blocker severity rules, redaction, retention/disposal, stop criteria, and rollback references exist.
- Final runtime trial review, operational handoff, decision record, known limitations review, evidence privacy review, issue disposition summary, signoff summary, post-P18 recommendation, and follow-up backlog exist.
- The next phase requires separate explicit approval.
- Stop criteria are required before broader rollout.
- Manual rollback guidance is required before broader rollout.
- Known limitations must be reviewed before broader rollout.
