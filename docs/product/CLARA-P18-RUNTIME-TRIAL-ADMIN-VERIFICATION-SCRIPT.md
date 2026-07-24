# CLARA P18 Runtime Trial Admin Verification Script

P18-PR-02 is current.

## Admin Checks

1. Verify P18-PR-01 is complete and P18-PR-02 is current.
2. Verify participant access is limited to approved internal users.
3. Verify AuthContext and workspace membership remain source of truth.
4. Verify client-supplied workspaceId is not authoritative.
5. Verify AI analysis remains backend/server-side and AI provider secrets remain server-only.
6. Verify extension must not call AI providers directly.
7. Verify evidence redaction rules and retention/disposal guidance are applied.
8. Verify stop criteria and manual rollback guidance are linked from the smoke checklist.
9. Verify no public SaaS launch, production deployment, billing/payment, official WA/IG/TikTok API activation, or outbound auto-send happened.

## Admin Evidence

Record only safe status, safe counts, safe reason codes, sanitized screenshots, and known issue links. Runtime evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.
