# CLARA P17 Real AI Analysis Runtime Policy

P17-PR-03 is current. Controlled backend real AI analysis is activated for
extension-assisted AI-ready context.

controlled backend real AI analysis is activated for extension-assisted AI-ready
context.

Runtime policy:

- Real AI analysis must fail closed when provider config is missing/invalid/disabled.
- Model allowlist, cost guardrail, rate limit guardrail, timeout policy, and prompt-injection boundary are enforced.
- AuthContext and workspace membership remain source of truth.
- Client-supplied workspaceId is not authoritative.
- Cross-workspace analysis is rejected.
- AI provider secrets are server-only.
- AI provider secrets must not be exposed to dashboard or extension.

Extension must not call AI providers directly. Outbound auto-send remains
disabled. Official WA/IG/TikTok APIs remain not activated. Billing/payment is
deferred. CLARA is not public SaaS launch. CLARA is not production deployment
claim unless separately executed.
