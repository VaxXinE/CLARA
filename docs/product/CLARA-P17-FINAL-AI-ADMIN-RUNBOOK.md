# CLARA P17 Final AI Admin Runbook

Admin checks before internal use:
- P17-PR-01 is complete.
- P17-PR-02 is complete.
- P17-PR-03 is complete.
- P17-PR-04 is complete.
- P18 Controlled Internal Runtime Trial + Operational Readiness is current.
- Real AI analysis uses only sanitized/redacted AI-ready context.
- Real AI analysis fails closed when provider config is missing/invalid/disabled.
- Model allowlist, cost guardrail, rate limit guardrail, timeout policy, and prompt-injection boundary are enforced.
- AuthContext and workspace membership remain source of truth.
- Client-supplied workspaceId is not authoritative.

Next phase is not billing/public launch unless separately approved.
