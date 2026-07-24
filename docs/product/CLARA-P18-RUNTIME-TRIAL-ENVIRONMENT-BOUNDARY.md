# CLARA P18 Runtime Trial Environment Boundary

P17 Real AI Analysis Activation is complete for controlled internal use.
P18 Controlled Internal Runtime Trial + Operational Readiness is current.
P18-PR-01 is complete.
P18-PR-02 is complete.
P18-PR-03 is current.

Allowed environments:
- Local/dev-safe environment.
- Explicit internal trial environment approved by admin/security.

Not allowed:
- Public SaaS launch.
- Production deployment claim.
- Billing/payment activation.
- Official WA/IG/TikTok API activation.
- Outbound auto-send.
- Extension direct AI provider calls.
- Frontend-readable AI provider secrets.

Environment requirements:
- AI provider secrets remain server-only.
- AI analysis remains backend/server-side.
- AuthContext and workspace membership remain source of truth.
- Client-supplied workspaceId is not authoritative.
- Dashboard must show safe review output only.
- Runtime evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.
