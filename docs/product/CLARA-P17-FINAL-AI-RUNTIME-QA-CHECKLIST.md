# CLARA P17 Final AI Runtime QA Checklist

P16 Extension-Assisted Channel Ingestion Hardening is complete.
P17 Real AI Analysis Activation is complete for controlled internal use.
P17-PR-01 is complete.
P17-PR-02 is complete.
P17-PR-03 is complete.
P17-PR-04 is complete.

P18 Controlled Internal Runtime Trial + Operational Readiness is current.
controlled backend real AI analysis is active for extension-assisted AI-ready context.
Real AI analysis is server-only.
Real AI analysis uses only sanitized/redacted AI-ready context.
Real AI analysis fails closed when provider config is missing/invalid/disabled.
Model allowlist, cost guardrail, rate limit guardrail, timeout policy, and prompt-injection boundary are enforced.

Runtime QA must verify:
- Sanitized extension snapshot becomes AI-ready context.
- Mock provider can execute local/dev-safe analysis.
- Safe/redacted analysis result is persisted.
- Dashboard review UI shows only safe AI analysis output.
- AuthContext and workspace membership remain source of truth.
- Client-supplied workspaceId is not authoritative.
- Cross-workspace reads return safe not-found behavior.

Runtime QA evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data.
