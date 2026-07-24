# CLARA P18 Runtime Trial Evidence Plan

P18 Controlled Internal Runtime Trial + Operational Readiness is current.
P18-PR-01 is complete.
P18-PR-02 is current.

Evidence to capture:
- Trial date, operator, role, workspace, and environment.
- Pipeline checkpoint status for extension snapshot -> sanitization/redaction ->
  workspace/operator attribution -> backend ingestion/dedup -> AI-ready context
  -> controlled backend real AI analysis -> safe persistence -> dashboard review
  UI.
- Safe counts, timestamps, reason codes, and pass/fail notes.
- Redacted screenshots only when needed.

Evidence privacy rule:
Runtime evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.

Guardrails:
- P18 is not public SaaS launch.
- P18 is not production deployment.
- P18 does not activate billing/payment.
- P18 does not activate official WA/IG/TikTok APIs.
- P18 does not enable outbound auto-send.
