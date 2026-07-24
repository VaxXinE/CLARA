# CLARA P18 Runtime Trial Participant Rules

P18 Controlled Internal Runtime Trial + Operational Readiness is current.
P18-PR-01 is complete.
P18-PR-02 is complete.
P18-PR-03 is current.

Participants:
- Operators may capture only visible active-chat context they are authorized to
  handle.
- Admins approve participant list, workspace access, and evidence review.
- Viewers may observe safe dashboard output only where existing RBAC allows.

Rules:
- Extension-assisted ingestion remains internal/controlled/user-assisted.
- AuthContext and workspace membership remain source of truth.
- Client-supplied workspaceId is not authoritative.
- AI analysis remains backend/server-side.
- AI provider secrets remain server-only.
- Extension must not call AI providers directly.
- P18 does not enable outbound auto-send.
- P18 does not activate official WA/IG/TikTok APIs.
- P18 does not activate billing/payment.
- P18 is not public SaaS launch.
- P18 is not production deployment.

Runtime evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.
